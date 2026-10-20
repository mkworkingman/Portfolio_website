import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { HTML_LANG, translations } from './src/scripts/translations'
import { LANGUAGES } from './src/scripts/values'

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

const sha256 = (text) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`

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
    plugins: [i18nReserve(), ViteMinifyPlugin({}), csp()],
    test: {
        environment: 'jsdom',
    },
})
