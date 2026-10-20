import { HTML_LANG, translations } from './translations'
import { isLanguage, type Language } from './values'

const STORAGE_KEY = 'lang'

/** Saved choice first, then the browser's preferred languages, then English. */
function detectLanguage(): Language {
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

function applyLanguage(lang: Language) {
    document.documentElement.lang = HTML_LANG[lang]

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n
        if (key) el.textContent = translations[lang][key]
    })

    document.querySelectorAll<HTMLElement>('[data-i18n-label]').forEach((el) => {
        const key = el.dataset.i18nLabel
        if (key) el.setAttribute('aria-label', translations[lang][key])
    })

    const current = document.querySelector<HTMLElement>('.lang__current')
    if (current) current.textContent = lang.toUpperCase()

    document.querySelectorAll<HTMLElement>('.lang__option').forEach((el) => {
        if (el.dataset.lang === lang) el.setAttribute('aria-current', 'true')
        else el.removeAttribute('aria-current')
    })
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
