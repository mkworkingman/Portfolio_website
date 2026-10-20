import type { Language, TextKey } from './values'

// Plain data with no DOM access, so vite.config.js can import it too (see the
// i18n-reserve plugin there).

// TODO: Make it JSON? Load those texts on click? If English is default language, what's the point of having ru and sr in the memory because not everyone will click to switch language
// TODO: Animated switch between languages?
export const translations: Record<Language, Record<TextKey, string>> = {
    en: {
        navHome: 'Home',
        navAbout: 'About',
        navSkills: 'Skills',
        navProjects: 'Projects',
        navContact: 'Contact Me',
        navMenu: 'Menu',
        langLabel: 'Language:',
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
        langLabel: 'Язык:',
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
        langLabel: 'Jezik:',
        contactClose: 'Zatvori',
        contactName: 'Vaše ime',
    },
}

/** Value for `<html lang>`. The Serbian copy is written in Latin script. */
export const HTML_LANG: Record<Language, string> = { en: 'en', ru: 'ru', sr: 'sr-Latn' }
