import { initLanguage } from './language'

interface Handler {
    selector: string
    fn: (match: HTMLElement) => void
}

const langList = document.querySelector<HTMLElement>('.lang__list')
const headerNavToggle = document.querySelector<HTMLElement>('.header-nav-toggle')
const headerNav = document.querySelector<HTMLElement>('.header-nav')
const contactModal = document.querySelector<HTMLDialogElement>('.contact-modal')

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
        const lang = match.dataset.lang
        initLanguage(lang)
    }

    function handleLinkClick() {
        headerNav?.classList.remove('is-open')
        headerNavToggle?.classList.remove('is-open')
    }

    // showModal() makes the rest of the page inert, closes on Escape
    // and returns focus to the opener on close.
    function handleShowContactMeModal() {
        contactModal?.showModal()
        // TODO: put `autofocus` on the first input (otherwise the close button gets focus)
        // TODO: save the state of the inputs
    }

    function handleCloseContactMeModal() {
        contactModal?.close()
    }

    const handlers: Handler[] = [
        { selector: 'li[data-lang]', fn: handleLanguageSwitch },
        { selector: '.header-nav__link', fn: handleLinkClick },
        { selector: '.header-contact', fn: handleShowContactMeModal },
        { selector: '.contact-modal__background', fn: handleCloseContactMeModal },
        { selector: '.contact-modal__close', fn: handleCloseContactMeModal },
    ]

    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof Element)) return

        const languageSwitcher = target.closest('.lang__switcher')
        const navSwitcher = target.closest('.header-nav-toggle')

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
            const match = target.closest(selector)
            if (match instanceof HTMLElement) return fn(match)
        }
    })
}
