import { initLanguage } from './language'
import { Language } from './values'

interface Hander {
    selector: string
    fn: (match: HTMLElement) => void
}

const langList = document.querySelector('.lang__list')

export function initClickHandler() {
    function handleLanguageSwitch(match: HTMLElement) {
        const lang = match.dataset.lang as Language
        initLanguage(lang)
    }

    const handlers: Hander[] = [{ selector: 'li[data-lang]', fn: handleLanguageSwitch }]

    document.addEventListener('click', (e) => {
        const languageSwitcher = (e.target as HTMLElement).closest('.lang__switcher') as HTMLElement

        if (languageSwitcher) {
            langList?.classList.toggle('is-open')
            return
        }
        langList?.classList.remove('is-open')

        for (const { selector, fn } of handlers) {
            const match = (e.target as HTMLElement).closest(selector) as HTMLElement | null
            if (match) return fn(match)
        }
    })
}
