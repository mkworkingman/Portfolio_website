import { type Language, type TextKey } from './values'

// TODO: Make it JSON? Load those texts on click? If English is default language, what's the point of having ru and sr in the memory because not everyone will click to switch language
// TODO: Animated switch between languages?
const translations: Record<Language, Record<TextKey, string>> = {
    en: {
        navHome: 'Home',
        navAbout: 'About',
        navSkills: 'Skills',
        navProjects: 'Projects',
        navContact: 'Contact Me',
    },
    ru: {
        navHome: 'Главная',
        navAbout: 'Обо мне',
        navSkills: 'Навыки',
        navProjects: 'Проекты',
        navContact: 'Связаться со мной',
    },
    sr: {
        navHome: 'Početna',
        navAbout: 'O meni',
        navSkills: 'Veštine',
        navProjects: 'Projekti',
        navContact: 'Kontaktirajte me',
    },
}

function applyTexts(lang: Language) {
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n as TextKey

        el.textContent = translations[lang][key]
    })
}

export function initLanguage() {
    applyTexts('en')

    document.getElementById('lang-switcher')?.addEventListener('click', (event) => {
        const item = (event.target as Element).closest('li')
        if (!item) return

        const lang = item.dataset.lang as Language
        applyTexts(lang)
    })
}
