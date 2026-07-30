// export function initToggleNavBar() {
//     const headerNavToggle = document.querySelector('.header-nav-toggle')
//     const headerNav = document.querySelector('.header-nav')

//     headerNavToggle?.addEventListener('click', () => {
//         headerNav?.classList.toggle('is-open')
//         headerNavToggle?.classList.toggle('is-open')
//     })

//     document.querySelector('.header-nav__links')?.addEventListener('click', (event) => {
//         const item = (event.target as Element).closest('li')
//         if (!item) return

//         headerNav?.classList.remove('is-open')
//         headerNavToggle?.classList.remove('is-open')
//     })
// }
