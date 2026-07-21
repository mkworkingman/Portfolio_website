export const LANGUAGES = ['en', 'ru', 'sr'] as const
export const TEXT_KEYS = ['navHome', 'navAbout', 'navSkills', 'navProjects', 'navContact'] as const

export type Language = (typeof LANGUAGES)[number]
export type TextKey = (typeof TEXT_KEYS)[number]
