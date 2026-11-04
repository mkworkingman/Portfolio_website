import { formStatusTexts, HTML_LANG, metaDescriptions, OG_LOCALE, translations } from './translations'
import { isFormStatus, isLanguage, LANGUAGE_PATH, languageFromPath, type Language } from './values'

const STORAGE_KEY = 'lang'

let currentLanguage: Language = 'en'

export const getLanguage = (): Language => currentLanguage

/**
 * The URL decides: /ru/ and /sr/ are served already translated. Only the root (English,
 * also the x-default) falls back to the saved choice, then the browser's preferred
 * languages. Crawlers have neither, so they always index the English root as English.
 */
function detectLanguage(): Language {
    const fromPath = languageFromPath(location.pathname)
    if (fromPath !== 'en') return fromPath

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (isLanguage(saved)) return saved
    } catch {
        // Storage can be blocked (private mode, disabled cookies); just skip it.
    }

    for (const tag of navigator.languages ?? []) {
        const base = tag.split('-')[0]?.toLowerCase()
        if (isLanguage(base)) return base
    }

    return 'en'
}

const setAttr = (doc: Document, selector: string, name: string, value: string) =>
    doc.querySelector(selector)?.setAttribute(name, value)

/**
 * Writes `lang` into a document: the text, labels, switcher state and the head tags.
 * Pure DOM with no globals, so the build (vite.config.js) runs it too, to pre-render
 * the page of each language.
 */
export function renderLanguage(doc: Document, lang: Language) {
    doc.documentElement.lang = HTML_LANG[lang]

    doc.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n
        if (key) el.textContent = translations[lang][key]
    })

    doc.querySelectorAll<HTMLElement>('[data-i18n-label]').forEach((el) => {
        const key = el.dataset.i18nLabel
        if (key) el.setAttribute('aria-label', translations[lang][key])
    })

    const current = doc.querySelector<HTMLElement>('.lang__current')
    if (current) current.textContent = lang.toUpperCase()

    doc.querySelectorAll<HTMLElement>('.lang__option').forEach((el) => {
        if (el.dataset.lang === lang) el.setAttribute('aria-current', 'true')
        else el.removeAttribute('aria-current')
    })

    // Head tags for crawlers and link previews. The origin comes from the canonical URL
    // in index.html, so the site address lives in one place.
    const canonical = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) {
        const url = new URL(LANGUAGE_PATH[lang], canonical.href).href
        canonical.href = url
        setAttr(doc, 'meta[property="og:url"]', 'content', url)
    }
    setAttr(doc, 'meta[name="description"]', 'content', metaDescriptions[lang])
    setAttr(doc, 'meta[property="og:description"]', 'content', metaDescriptions[lang])
    setAttr(doc, 'meta[property="og:title"]', 'content', translations[lang].pageTitle)
    setAttr(doc, 'meta[property="og:locale"]', 'content', OG_LOCALE[lang])
}

function applyLanguage(lang: Language) {
    currentLanguage = lang
    renderLanguage(document, lang)

    // A contact form message on screen follows the switch too.
    const formStatus = document.querySelector<HTMLElement>('.contact-form__status')
    const status = formStatus?.dataset.status
    if (formStatus && isFormStatus(status)) formStatus.textContent = formStatusTexts[lang][status]

    // The address bar follows the language, so a copied link opens the same page.
    // replaceState: a switch isn't a navigation, Back shouldn't step through languages.
    const path = LANGUAGE_PATH[lang]
    if (location.pathname !== path) {
        history.replaceState(history.state, '', path + location.search + location.hash)
    }
}

export function initLanguage() {
    applyLanguage(detectLanguage())
    // Set by the inline script in index.html to hide the English defaults until now.
    document.documentElement.classList.remove('i18n-pending')
}

/** Switches language and remembers the choice for the next visit. */
export function setLanguage(lang: Language) {
    applyLanguage(lang)

    try {
        localStorage.setItem(STORAGE_KEY, lang)
    } catch {
        // Not remembered, but the switch itself still worked.
    }
}
