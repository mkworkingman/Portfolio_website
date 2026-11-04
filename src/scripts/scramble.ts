import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

// Loaded on demand by language.ts, so visitors who never switch language don't
// download GSAP.

gsap.registerPlugin(ScrambleTextPlugin)

/** The noise is drawn from all three alphabets: Latin, Cyrillic and Serbian Latin. */
const CHARS = 'abcdefghijklmnopqrstuvwxyzабвгдежзиклмнопрстуфхцчшщыэюяčćđšž'

const DURATION = 0.3

/**
 * Scrambles the element's text into `text`. A new call on the same element
 * replaces the running tween, so fast repeated switches don't fight.
 */
export function scrambleTo(el: HTMLElement, text: string) {
    // Already showing it. A running tween still has to be redirected, though,
    // in case it's heading to a language that was picked a moment ago.
    if (el.textContent === text && !gsap.isTweening(el)) return

    // Uppercase codes (EN/RU/SR) stay uppercase while they scramble.
    const chars = text === text.toUpperCase() ? CHARS.toUpperCase() : CHARS

    gsap.to(el, {
        duration: DURATION,
        ease: 'none',
        overwrite: true,
        scrambleText: { text, chars, speed: 0.6 },
    })
}
