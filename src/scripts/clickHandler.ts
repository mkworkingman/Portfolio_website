import { initLanguage } from './language'
import { Language } from './values'

interface Handler {
    selector: string
    fn: (match: HTMLElement) => void
}

const header = document.querySelector('.header')
const main = document.querySelector('.main')
const footer = document.querySelector('.footer')
const langList = document.querySelector('.lang__list')
const headerNavToggle = document.querySelector('.header-nav-toggle')
const headerContactButton = document.querySelector<HTMLElement>('.header-contact')
const headerNav = document.querySelector('.header-nav')
const contactModal = document.querySelector('.contact-modal')

function handleSelectNavClick(element?: 'languageSwitcher' | 'navSwitcher') {
    if (element !== 'languageSwitcher') {
        langList?.classList.remove('is-open')
    }
    if (element !== 'navSwitcher') {
        headerNavToggle?.classList.remove('is-open')
        headerNav?.classList.remove('is-open')
    }
}

export function initClickHandler() {
    function handleLanguageSwitch(match: HTMLElement) {
        const lang = match.dataset.lang as Language
        initLanguage(lang)
    }

    function handleLinkClick() {
        headerNav?.classList.remove('is-open')
        headerNavToggle?.classList.remove('is-open')
    }

    function handleEscClose(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            handleCloseContactMeModal()
        }
    }

    function handleShowContactMeModal() {
        contactModal?.classList.add('is-open')
        header?.setAttribute('inert', '')
        main?.setAttribute('inert', '')
        footer?.setAttribute('inert', '')
        document.addEventListener('keydown', handleEscClose)
        // TODO: add focus on the first input
        // TODO: save the state of the inputs
    }

    function handleCloseContactMeModal() {
        contactModal?.classList.remove('is-open')
        header?.removeAttribute('inert')
        main?.removeAttribute('inert')
        footer?.removeAttribute('inert')
        document.removeEventListener('keydown', handleEscClose)
        headerContactButton?.focus()
    }

    const handlers: Handler[] = [
        { selector: 'li[data-lang]', fn: handleLanguageSwitch },
        { selector: '.header-nav__link', fn: handleLinkClick },
        { selector: '.header-contact', fn: handleShowContactMeModal },
        { selector: '.contact-modal__background', fn: handleCloseContactMeModal },
        { selector: '.contact-modal__close', fn: handleCloseContactMeModal },
    ]

    document.addEventListener('click', (e) => {
        const languageSwitcher = (e.target as HTMLElement).closest('.lang__switcher') as HTMLElement
        const navSwitcher = (e.target as HTMLElement).closest('.header-nav-toggle') as HTMLElement

        if (languageSwitcher) {
            langList?.classList.toggle('is-open')
            handleSelectNavClick('languageSwitcher')
            return
        }

        if (navSwitcher) {
            headerNavToggle?.classList.toggle('is-open')
            headerNav?.classList.toggle('is-open')
            handleSelectNavClick('navSwitcher')
            return
        }

        handleSelectNavClick()

        for (const { selector, fn } of handlers) {
            const match = (e.target as HTMLElement).closest(selector) as HTMLElement | null
            if (match) return fn(match)
        }
    })
}
