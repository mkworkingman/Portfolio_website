import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { JSDOM } from 'jsdom'
import { renderLanguage } from './src/scripts/language'
import { HTML_LANG, translations } from './src/scripts/translations'
import { LANGUAGE_PATH, LANGUAGES } from './src/scripts/values'

const escapeHtml = (text) =>
    text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')

/**
 * Replaces each `<!-- i18n-reserve:key -->` in index.html with invisible copies of that
 * key in every language. Stacked in one grid cell next to the live text, they keep the
 * element as wide as its longest translation, so switching language doesn't shift the
 * layout. Done at build time so the width is right from the first paint.
 */
function i18nReserve() {
    return {
        name: 'i18n-reserve',
        transformIndexHtml: {
            // Before the minifier strips the comments.
            order: 'pre',
            handler: (html) =>
                html.replace(/<!-- i18n-reserve:(\w+) -->/g, (_, key) => {
                    if (!(key in translations.en)) {
                        throw new Error(`i18n-reserve: unknown text key "${key}"`)
                    }

                    return LANGUAGES.map(
                        (lang) =>
                            `<span class="i18n-reserve__ghost" lang="${HTML_LANG[lang]}" aria-hidden="true">${escapeHtml(translations[lang][key])}</span>`,
                    ).join('')
                }),
        },
    }
}

/**
 * Fills each `<!-- i18n-group-ghosts -->` (placed right after a `.i18n-group__live`
 * block) with an invisible copy of that block per language. They share one grid cell
 * with the live block, so the group keeps the size of its longest language and switching
 * moves nothing around it, while the text inside still flows with its normal spacing.
 * The copies lose ids, comments and data-i18n* attributes, so they stay out of the
 * accessibility tree, id lookups and language switching.
 */
function i18nGroups() {
    const ghost = (inner, lang) =>
        inner
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<(\w+)([^>]*?)\sdata-i18n="(\w+)"([^>]*)>[^<]*<\/\1>/g, (_, tag, a, key, b) => {
                if (!(key in translations[lang])) {
                    throw new Error(`i18n-group: unknown text key "${key}"`)
                }
                return `<${tag}${a}${b}>${escapeHtml(translations[lang][key])}</${tag}>`
            })
            .replace(/\s(id|for|data-i18n-label)="[^"]*"/g, '')
            .replace(/\sautofocus\b/g, '')

    return {
        name: 'i18n-group',
        transformIndexHtml: {
            // Before the minifier strips the comments.
            order: 'pre',
            handler: (html) =>
                html.replace(
                    /<div class="i18n-group__live">([\s\S]*?)<\/div>(\s*)<!-- i18n-group-ghosts -->/g,
                    (_, inner, space) =>
                        `<div class="i18n-group__live">${inner}</div>${space}` +
                        LANGUAGES.map(
                            (lang) =>
                                `<div class="i18n-group__ghost" lang="${HTML_LANG[lang]}" aria-hidden="true">${ghost(inner, lang)}</div>`,
                        ).join(''),
                ),
        },
    }
}

/**
 * Writes one pre-translated page per language (index.html, ru/index.html, sr/index.html)
 * from the finished index.html, so each URL serves its own language in the HTML with the
 * right <html lang>, title, description and canonical, instead of English swapped by JS.
 * Runs renderLanguage() from language.ts, the same code as a switch in the browser.
 * Also emits sitemap.xml with the hreflang alternates. Runs after the minifier and the
 * CSP plugin; the inline <script>/<style> are left untouched, so their hashes still hold.
 */
function i18nPages() {
    return {
        name: 'i18n-pages',
        apply: 'build',
        enforce: 'post',
        generateBundle(_, bundle) {
            const page = bundle['index.html']
            if (page?.type !== 'asset') throw new Error('i18n-pages: index.html not in the bundle')
            const source = String(page.source)

            let origin
            for (const lang of LANGUAGES) {
                const dom = new JSDOM(source)
                const doc = dom.window.document
                origin ??= new URL(doc.querySelector('link[rel="canonical"]').href).origin

                const alternates = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')]
                    .map((link) => `${link.hreflang} ${new URL(link.href).pathname}`)
                    .sort()
                const expected = [
                    ...LANGUAGES.map((l) => `${HTML_LANG[l]} ${LANGUAGE_PATH[l]}`),
                    `x-default ${LANGUAGE_PATH.en}`,
                ].sort()
                if (alternates.join() !== expected.join()) {
                    throw new Error(`i18n-pages: hreflang links in index.html should be: ${expected.join(', ')}`)
                }

                renderLanguage(doc, lang)
                const html = dom.serialize()

                if (lang === 'en') page.source = html
                else this.emitFile({ type: 'asset', fileName: `${lang}/index.html`, source: html })
            }

            const links = LANGUAGES.map(
                (l) => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${origin}${LANGUAGE_PATH[l]}"/>`,
            ).join('')
            const urls = LANGUAGES.map(
                (lang) =>
                    `<url><loc>${origin}${LANGUAGE_PATH[lang]}</loc>${links}` +
                    `<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/></url>`,
            ).join('')
            this.emitFile({
                type: 'asset',
                fileName: 'sitemap.xml',
                source:
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
                    `${urls}</urlset>`,
            })
        },
    }
}

const sha256 =(text) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`

/**
 * Adds a Content-Security-Policy <meta> to the built page. The inline <script> and
 * <style> in index.html are allowed by hash, so they are hashed after the minifier
 * has rewritten them. Build only: the dev server injects styles and HMR code the
 * policy would block. frame-ancestors and nosniff can't be set from a <meta>; they
 * need real response headers from the host.
 */
function csp() {
    return {
        name: 'csp',
        apply: 'build',
        transformIndexHtml: {
            // Registered after ViteMinifyPlugin, so this sees the minified inline code.
            order: 'post',
            handler: (html) => {
                const inline = (tag) =>
                    [...html.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map(
                        ([, body]) => sha256(body),
                    )

                const policy = [
                    "default-src 'self'",
                    `script-src 'self' ${inline('script').join(' ')}`,
                    `style-src 'self' ${inline('style').join(' ')}`,
                    // The contact form posts to Web3Forms with fetch().
                    "connect-src 'self' https://api.web3forms.com",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                ].join('; ')

                return html.replace(
                    '<head>',
                    `<head><meta http-equiv="Content-Security-Policy" content="${policy}">` +
                        '<meta name="referrer" content="strict-origin-when-cross-origin">',
                )
            },
        },
    }
}

export default defineConfig({
    plugins: [i18nGroups(), i18nReserve(), ViteMinifyPlugin({}), csp(), i18nPages()],
    test: {
        environment: 'jsdom',
    },
})
