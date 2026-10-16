import { isLanguage, type Language, type TextKey } from './values'

// TODO: Make it JSON? Load those texts on click? If English is default language, what's the point of having ru and sr in the memory because not everyone will click to switch language
// TODO: Animated switch between languages?
const translations: Record<Language, Record<TextKey, string>> = {
    en: {
        navHome: 'Home',
        navAbout: 'About',
        navSkills: 'Skills',
        navProjects: 'Projects',
        navContact: 'Contact Me',
        navMenu: 'Menu',
        contactClose: 'Close',
        contactName: 'Your name',
    },
    ru: {
        navHome: 'Главная',
        navAbout: 'Обо мне',
        navSkills: 'Навыки',
        navProjects: 'Проекты',
        navContact: 'Связаться со мной',
        navMenu: 'Меню',
        contactClose: 'Закрыть',
        contactName: 'Ваше имя',
    },
    sr: {
        navHome: 'Početna',
        navAbout: 'O meni',
        navSkills: 'Veštine',
        navProjects: 'Projekti',
        navContact: 'Kontaktirajte me',
        navMenu: 'Meni',
        contactClose: 'Zatvori',
        contactName: 'Vaše ime',
    },
}

/** Value for `<html lang>`. The Serbian copy is written in Latin script. */
const HTML_LANG: Record<Language, string> = { en: 'en', ru: 'ru', sr: 'sr-Latn' }

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

    const switcher = document.querySelector<HTMLElement>('.lang__switcher')
    if (switcher) switcher.textContent = lang.toUpperCase()
}

export function initLanguage() {
    applyLanguage(detectLanguage())
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
