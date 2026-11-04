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

type ScrambleModule = typeof import('./scramble')
let scramble: Promise<ScrambleModule | null> | undefined

/** Starts loading GSAP (once), e.g. when the language list opens, ahead of the click. */
export function preloadScramble() {
    // A failed load just means switching without the animation.
    scramble ??= import('./scramble').catch(() => null)
    return scramble
}

/**
 * Scramble only when the visitor is fine with motion. matchMedia is missing in
 * jsdom, so the tests get the instant swap.
 */
const shouldAnimate = () =>
    typeof matchMedia === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches

/** Swaps visible text, scrambling from the old language into the new one when `animate`. */
function setTexts(changes: [HTMLElement, string][], animate: boolean) {
    const instant = () => changes.forEach(([el, text]) => (el.textContent = text))

    if (!animate) return instant()

    void preloadScramble().then((mod) => {
        if (!mod) return instant()
        changes.forEach(([el, text]) => mod.scrambleTo(el, text))
    })
}

function applyLanguage(lang: Language, animate: boolean) {
    document.documentElement.lang = HTML_LANG[lang]

    const changes: [HTMLElement, string][] = []

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n
        if (key) changes.push([el, translations[lang][key]])
    })

    const current = document.querySelector<HTMLElement>('.lang__current')
    if (current) changes.push([current, lang.toUpperCase()])

    setTexts(changes, animate)

    document.querySelectorAll<HTMLElement>('[data-i18n-label]').forEach((el) => {
        const key = el.dataset.i18nLabel
        if (key) el.setAttribute('aria-label', translations[lang][key])
    })

    document.querySelectorAll<HTMLElement>('.lang__option').forEach((el) => {
        if (el.dataset.lang === lang) el.setAttribute('aria-current', 'true')
        else el.removeAttribute('aria-current')
    })
}

export function initLanguage() {
    applyLanguage(detectLanguage(), false)
    // Set by the inline script in index.html to hide the English defaults until now.
    document.documentElement.classList.remove('i18n-pending')
}

/** Switches language and remembers the choice for the next visit. */
export function setLanguage(lang: Language) {
    applyLanguage(lang, shouldAnimate())

    try {
        localStorage.setItem(STORAGE_KEY, lang)
    } catch {
        // Not remembered, but the switch itself still worked.
    }
}
