import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { HTML_LANG, translations } from './src/scripts/translations'
import { LANGUAGES } from './src/scripts/values'

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
                            `<span class="i18n-reserve__ghost" lang="${HTML_LANG[lang]}" aria-hidden="true">${translations[lang][key]}</span>`,
                    ).join('')
                }),
        },
    }
}

export default defineConfig({
    plugins: [i18nReserve(), ViteMinifyPlugin({})],
    test: {
        environment: 'jsdom',
    },
})
