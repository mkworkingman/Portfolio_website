export const LANGUAGES = ['en', 'ru', 'sr'] as const
export const TEXT_KEYS = [
    'navHome',
    'navAbout',
    'navSkills',
    'navProjects',
    'navContact',
    'navMenu',
    'langLabel',
    'contactClose',
    'contactName',
] as const

export type Language = (typeof LANGUAGES)[number]
export type TextKey = (typeof TEXT_KEYS)[number]

export function isLanguage(value: unknown): value is Language {
    return LANGUAGES.includes(value as Language)
}
