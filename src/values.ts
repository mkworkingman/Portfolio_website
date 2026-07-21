const LANGUAGES = ['en', 'ru', 'sr'] as const
const TEXT_KEYS = ['navHome', 'navAbout', 'navSkills', 'navProjects', 'navContact'] as const

export type Language = (typeof LANGUAGES)[number]
export type TextKey = (typeof TEXT_KEYS)[number]

export function isLanguage(value: string | undefined): value is Language {
    return !!value && (LANGUAGES as readonly string[]).includes(value)
}

export function isTextKey(value: string | undefined): value is TextKey {
    return !!value && (TEXT_KEYS as readonly string[]).includes(value)
}
