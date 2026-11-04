/**
 * Marks the header nav link of the section currently in view with
 * aria-current="location", which the styles use for the highlight.
 */
export function initNavHighlight() {
    const header = document.querySelector<HTMLElement>('.header')
    const entries = [...document.querySelectorAll<HTMLAnchorElement>('.header-nav__link')]
        .map((link) => {
            const id = link.getAttribute('href')?.slice(1)
            const section = id ? document.getElementById(id) : null
            return section ? { link, section } : null
        })
        .filter((entry) => entry !== null)

    if (!entries.length) return

    let current: HTMLAnchorElement | undefined

    function update() {
        const headerBottom = header?.getBoundingClientRect().bottom ?? 0
        // A section counts as reached once its top passes the upper third of
        // the area below the header, so it lights up before it fills the screen.
        const line = headerBottom + (innerHeight - headerBottom) / 3

        // The last sections may be too short to ever reach the line, so at the
        // bottom of the page the last one wins.
        const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 1

        let active = entries[0]
        if (atBottom) active = entries[entries.length - 1]
        else {
            for (const entry of entries) {
                if (entry.section.getBoundingClientRect().top <= line) active = entry
            }
        }

        if (active?.link === current) return
        current?.removeAttribute('aria-current')
        active?.link.setAttribute('aria-current', 'location')
        current = active?.link
    }

    let scheduled = false
    function schedule() {
        if (scheduled) return
        scheduled = true
        requestAnimationFrame(() => {
            scheduled = false
            update()
        })
    }

    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    update()
}
