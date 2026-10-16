import { setLanguage } from './language'
import { isLanguage } from './values'

interface Handler {
    selector: string
    fn: (match: HTMLElement) => void
}

const langSwitcher = document.querySelector<HTMLElement>('.lang__switcher')
const langList = document.querySelector<HTMLElement>('.lang__list')
const headerNavToggle = document.querySelector<HTMLElement>('.header-nav-toggle')
const headerNav = document.querySelector<HTMLElement>('.header-nav')
const contactModal = document.querySelector<HTMLDialogElement>('.contact-modal')

const isOpen = (el: HTMLElement | null) => el?.classList.contains('is-open') ?? false

function setLangListOpen(open: boolean) {
    langList?.classList.toggle('is-open', open)
    langSwitcher?.setAttribute('aria-expanded', String(open))
}

function setNavOpen(open: boolean) {
    headerNavToggle?.classList.toggle('is-open', open)
    headerNav?.classList.toggle('is-open', open)
    headerNavToggle?.setAttribute('aria-expanded', String(open))
}

function closeMenus(except?: 'languageSwitcher' | 'navSwitcher') {
    if (except !== 'languageSwitcher') setLangListOpen(false)
    if (except !== 'navSwitcher') setNavOpen(false)
}

export function initClickHandler() {
    function handleLanguageSwitch(match: HTMLElement) {
        const lang = match.dataset.lang
        if (!isLanguage(lang)) return

        setLanguage(lang)
        // The option that had focus is hidden along with the list.
        langSwitcher?.focus()
    }

    // showModal() makes the rest of the page inert, focuses the [autofocus]
    // input, closes on Escape and returns focus to the opener on close.
    function handleShowContactMeModal() {
        contactModal?.showModal()
        // TODO: save the state of the inputs
    }

    function handleCloseContactMeModal() {
        contactModal?.close()
    }

    const handlers: Handler[] = [
        { selector: '[data-lang]', fn: handleLanguageSwitch },
        { selector: '.header-contact', fn: handleShowContactMeModal },
        { selector: '.contact-modal__background', fn: handleCloseContactMeModal },
        { selector: '.contact-modal__close', fn: handleCloseContactMeModal },
    ]

    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof Element)) return

        const languageSwitcher = target.closest('.lang__switcher')
        const navSwitcher = target.closest('.header-nav-toggle')

        if (languageSwitcher) {
            setLangListOpen(!isOpen(langList))
            closeMenus('languageSwitcher')
            return
        }

        if (navSwitcher) {
            setNavOpen(!isOpen(headerNav))
            closeMenus('navSwitcher')
            return
        }

        // Any other click, nav links included, closes the open menus.
        closeMenus()

        for (const { selector, fn } of handlers) {
            const match = target.closest(selector)
            if (match instanceof HTMLElement) return fn(match)
        }
    })

    // Escape closes an open menu and hands focus back to its toggle.
    // The dialog handles its own Escape.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return

        if (isOpen(langList)) {
            setLangListOpen(false)
            langSwitcher?.focus()
        }

        if (isOpen(headerNav)) {
            setNavOpen(false)
            headerNavToggle?.focus()
        }
    })

    // Close the mobile menu once the desktop nav takes over (e.g. rotating a phone),
    // so it isn't still open when the layout goes back to mobile.
    // The breakpoint comes from the SCSS tokens; it is empty when no stylesheet is
    // loaded (the jsdom tests, which also lack matchMedia), so skip it then.
    const md = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim()
    if (md) {
        matchMedia(`(min-width: ${md})`).addEventListener('change', (e) => {
            if (e.matches) setNavOpen(false)
        })
    }
}
