import { getLanguage } from './language'
import { formStatusTexts } from './translations'
import type { FormStatus } from './values'

const ENDPOINT = 'https://api.web3forms.com/submit'

function showStatus(el: HTMLElement, status: FormStatus) {
    // data-status lets language.ts re-translate the message on a language switch.
    el.dataset.status = status
    el.textContent = formStatusTexts[getLanguage()][status]
}

/**
 * Sends the contact form to Web3Forms, which emails it on. No backend of our own:
 * the access key in the form's hidden input is public by design.
 * A submit listener, not a click: it also catches Enter and runs only after the
 * browser's built-in validation (required, type="email") has passed.
 */
export function initContactForm() {
    const form = document.querySelector<HTMLFormElement>('.contact-form')
    const status = form?.querySelector<HTMLElement>('.contact-form__status')
    const submit = form?.querySelector<HTMLButtonElement>('.contact-form__submit')
    if (!form || !status || !submit) return

    let sending = false
    const setStatus = (next: FormStatus) => showStatus(status, next)

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        if (sending) return

        // aria-disabled rather than disabled: disabling the focused button would drop
        // focus to <body>, out of the open dialog.
        sending = true
        submit.setAttribute('aria-disabled', 'true')
        setStatus('sending')

        try {
            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form),
            })
            const data: unknown = await response.json()
            const ok =
                response.ok &&
                typeof data === 'object' &&
                data !== null &&
                'success' in data &&
                data.success === true

            if (!ok) throw new Error('Web3Forms rejected the submission')

            form.reset()
            setStatus('success')
        } catch {
            setStatus('error')
        } finally {
            sending = false
            submit.removeAttribute('aria-disabled')
        }
    })
}
