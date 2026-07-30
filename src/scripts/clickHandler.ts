export function initClickHandler() {
    // TODO: like that?
    // const handlers = [
    //     // { selector: '.', fn: handle },
    //     // { selector: '.', fn: handle },
    // ]

    const langList = document.querySelector('.lang__list')

    document.addEventListener('click', (e) => {
        const langSwitcher = (e.target as Element).closest('.lang__switcher')
        if (langSwitcher) {
            langList?.classList.toggle('is-open')
        } else {
            langList?.classList.remove('is-open')
        }
    })
}
