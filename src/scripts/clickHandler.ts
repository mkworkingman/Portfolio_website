import { initLanguage } from './language'
import { Language } from './values'

interface Hander {
    selector: string
    fn: (match: HTMLElement) => void
}

const langList = document.querySelector('.lang__list')
const headerNavToggle = document.querySelector('.header-nav-toggle')
const headerNav = document.querySelector('.header-nav')

export function initClickHandler() {
    function handleLanguageSwitch(match: HTMLElement) {
        const lang = match.dataset.lang as Language
        initLanguage(lang)
    }

    function handleNavBarToggle() {
        headerNav?.classList.toggle('is-open')
        headerNavToggle?.classList.toggle('is-open')
    }

    function handleLinkClick() {
        headerNav?.classList.remove('is-open')
        headerNavToggle?.classList.remove('is-open')
    }

    const handlers: Hander[] = [
        { selector: 'li[data-lang]', fn: handleLanguageSwitch },
        { selector: '.header-nav-toggle', fn: handleNavBarToggle },
        { selector: '.header-nav__link', fn: handleLinkClick },
    ]

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
