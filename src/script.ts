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

// TODO: Maybe to remove all console.warn and checks when the site is ready
function applyTexts(lang: Language) {
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n as TextKey

        el.textContent = translations[lang][key]
    })
}

applyTexts('en')

document.getElementById('lang-switcher')?.addEventListener('click', (event) => {
    const item = (event.target as Element).closest('li')
    if (!item) return

    const lang = item.dataset.lang as Language

    applyTexts(lang)
})
