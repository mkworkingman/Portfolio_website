export function initToggleNavBar() {
    const navBarToggle = document.getElementById('header-nav-toggle')
    const headerNav = document.getElementById('header-nav')

    navBarToggle?.addEventListener('click', () => {
        headerNav?.classList.toggle('is-open')
        navBarToggle?.classList.toggle('is-open')
    })

    document.getElementById('header-nav__links')?.addEventListener('click', (event) => {
        const item = (event.target as Element).closest('li')
        if (!item) return

        headerNav?.classList.remove('is-open')
        navBarToggle?.classList.remove('is-open')
    })
}
