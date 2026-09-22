import type { Language, TextKey } from './scripts/values'

declare global {
    interface DOMStringMap {
        lang?: Language
        i18n?: TextKey
    }
}
