export const LANGUAGES = ['en', 'ru', 'sr'] as const

/**
 * Each language's own URL. English stays at the root (also the x-default); the build
 * writes a pre-translated page for the others (i18nPages in vite.config.js).
 */
export const LANGUAGE_PATH = { en: '/', ru: '/ru/', sr: '/sr/' } as const satisfies Record<
    (typeof LANGUAGES)[number],
    string
>

/** The language a URL path belongs to: /ru and /ru/... are Russian, everything else English. */
export function languageFromPath(pathname: string): Language {
    const segment = pathname.split('/')[1]
    return segment !== 'en' && isLanguage(segment) ? segment : 'en'
}
export const TEXT_KEYS = [
    // <title>, so the tab name follows the language too
    'pageTitle',
    'skipLink',

    // Header
    'navHome',
    'navAbout',
    'navExperience',
    'navSkills',
    'navProjects',
    'navContact',
    'navMenu',
    'langLabel',

    // Hero
    'heroEyebrow',
    'heroSubtitle',

    // About
    'aboutHeading',
    'aboutP1',
    'aboutP2',
    'aboutP3',

    // Experience
    'expHeading',
    'expPresent',
    'expIndRole',
    'expIndText',
    'expWgRole',
    'expWg1',
    'expWg2',
    'expWg3',
    'expWg4',
    'expLxRole',
    'expLx1',
    'expLx2',
    'expLx3',
    'expFlRole',
    'expFl1',
    'expFl2',
    'expEdRole',
    'expEd1',
    'expEd2',
    'expEarlyRole',
    'expEarly1',
    'expEarly2',

    // Skills
    'skillsHeading',
    'skillsFrontend',
    'skillsBackend',
    'skillsTooling',
    'skillsPractices',
    'skillsA11y',
    'skillsI18n',
    'skillsPerf',
    'skillsDesignSystems',
    'skillsArchitecture',
    'skillsReview',
    'skillsAi',

    // Projects
    'projectsHeading',
    'projWtStatus',
    'projWtText',

    // Contact modal
    'contactTitle',
    'contactClose',
    'contactText',
    'contactEmail',
    'contactFormRequired',
    'contactFormName',
    'contactFormEmail',
    'contactFormMessage',
    'contactFormSend',
] as const

// Runtime-only texts (not in the HTML, so they live outside TEXT_KEYS).
export const FORM_STATUSES = ['sending', 'success', 'error'] as const
export type FormStatus = (typeof FORM_STATUSES)[number]

export type Language = (typeof LANGUAGES)[number]
export type TextKey = (typeof TEXT_KEYS)[number]

export function isLanguage(value: unknown): value is Language {
    return LANGUAGES.includes(value as Language)
}

export function isFormStatus(value: unknown): value is FormStatus {
    return FORM_STATUSES.includes(value as FormStatus)
}
