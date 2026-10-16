import type { TextKey } from './scripts/values'

// `data-lang` is deliberately left as a plain string: it comes from the DOM,
// so it gets checked with isLanguage() instead of being trusted.
declare global {
    interface DOMStringMap {
        /** Sets the element's text. */
        i18n?: TextKey
        /** Sets the element's aria-label, for icon-only buttons. */
        i18nLabel?: TextKey
    }
}
