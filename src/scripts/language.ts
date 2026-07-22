import { type Language, type TextKey } from './values'

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
        2 == 3
        // const item = (event.target as Element).closest('li')
        // if (!item) return

        // const lang = item.dataset.lang as Language
        // applyTexts(lang)
    })
}
