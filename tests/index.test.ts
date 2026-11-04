import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { renderLanguage, setLanguage } from '../src/scripts/language'
import { LANGUAGE_PATH, LANGUAGES, languageFromPath, TEXT_KEYS } from '../src/scripts/values'

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8')

beforeAll(async () => {
    document.body.innerHTML = html
    await import('../src/scripts/index')
})

describe('HTML', () => {
    it('contains exactly one data-lang element for each language, no duplicates', () => {
        const langValues = [...document.querySelectorAll<HTMLElement>('[data-lang]')].map(
            (el) => el.dataset.lang,
        )

        const expected = [...LANGUAGES].sort()
        const actual = langValues.sort()

        expect(actual).toEqual(expected)
    })

    it('contains exactly one data-i18n / data-i18n-label element for each text key, no duplicates', () => {
        const i18nValues = [
            ...document.querySelectorAll<HTMLElement>('[data-i18n], [data-i18n-label]'),
        ].map((el) => el.dataset.i18n ?? el.dataset.i18nLabel)

        const expected = [...TEXT_KEYS].sort()
        const actual = i18nValues.sort()

        expect(actual).toEqual(expected)
    })

    it('contain ids for each href="#..."', () => {
        for (const link of document.querySelectorAll('a[href^="#"]')) {
            const id = link.getAttribute('href')?.slice(1)
            expect(id).toBeTruthy()
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(document.getElementById(id!), `#${id} not found`).not.toBeNull()
        }
    })

    it('points every aria-labelledby / aria-controls at an existing id', () => {
        for (const el of document.querySelectorAll('[aria-labelledby], [aria-controls]')) {
            const ids = [
                el.getAttribute('aria-labelledby'),
                el.getAttribute('aria-controls'),
            ].flatMap((value) => value?.split(' ') ?? [])

            for (const id of ids) {
                expect(document.getElementById(id), `#${id} not found`).not.toBeNull()
            }
        }
    })

    it('labels every main section with its heading', () => {
        for (const section of document.querySelectorAll('main > section')) {
            expect(section.getAttribute('aria-labelledby'), `#${section.id}`).toBeTruthy()
        }
    })

    it('has exactly one h1', () => {
        expect(document.querySelectorAll('h1')).toHaveLength(1)
    })

    it('lists an hreflang alternate for every language URL, plus x-default', () => {
        const alternates = [
            ...document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'),
        ].map((link) => [link.hreflang, new URL(link.href).pathname])

        expect(alternates).toEqual(
            expect.arrayContaining([
                ...LANGUAGES.map((lang) => [expect.any(String), LANGUAGE_PATH[lang]]),
                ['x-default', '/'],
            ]),
        )
        expect(alternates).toHaveLength(LANGUAGES.length + 1)
    })

    it('maps URL paths to languages', () => {
        expect(languageFromPath('/')).toBe('en')
        expect(languageFromPath('/ru/')).toBe('ru')
        expect(languageFromPath('/sr')).toBe('sr')
        expect(languageFromPath('/en/')).toBe('en')
        expect(languageFromPath('/de/')).toBe('en')
    })

    it('has no duplicate ids', () => {
        const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
        expect(ids.length === new Set(ids).size).toBe(true)
    })
})

describe('Runtime', () => {
    // The DOM is shared across tests, so put back the language each test may have switched.
    afterEach(() => {
        setLanguage('en')
        localStorage.clear()
    })

    it('applies English translations on load', () => {
        const homeLink = document.querySelector<HTMLElement>('[data-i18n="navHome"]')
        expect(homeLink?.textContent).toBe('Home')
    })

    it('switches language when a lang item is clicked (event delegation check)', () => {
        const ruItem = document.querySelector<HTMLElement>('[data-lang="ru"]')
        expect(ruItem).toBeTruthy()

        // @ts-expect-error expect(ruItem).toBeTruthy() guarantees that ruItem is a truthy value
        ruItem.click()

        const homeLink = document.querySelector<HTMLElement>('[data-i18n="navHome"]')
        expect(homeLink?.textContent).toBe('Главная')
    })

    it('shows the current language on the switcher button', () => {
        const current = document.querySelector<HTMLElement>('.lang__current')

        document.querySelector<HTMLElement>('[data-lang="sr"]')?.click()
        expect(current?.textContent).toBe('SR')

        document.querySelector<HTMLElement>('[data-lang="en"]')?.click()
        expect(current?.textContent).toBe('EN')
    })

    it('marks only the active language option with aria-current', () => {
        document.querySelector<HTMLElement>('[data-lang="ru"]')?.click()

        const current = [...document.querySelectorAll<HTMLElement>('[aria-current="true"]')]
        expect(current.map((el) => el.dataset.lang)).toEqual(['ru'])
    })

    it('ships the same English in the HTML as switching to English produces', () => {
        const initial = new DOMParser().parseFromString(html, 'text/html')
        const read = (root: ParentNode) =>
            [...root.querySelectorAll<HTMLElement>('[data-i18n], [data-i18n-label]')].map((el) =>
                el.dataset.i18n ? el.textContent?.trim() : el.getAttribute('aria-label'),
            )

        document.querySelector<HTMLElement>('[data-lang="ru"]')?.click()
        document.querySelector<HTMLElement>('[data-lang="en"]')?.click()

        expect(read(document)).toEqual(read(initial))
    })

    it('updates <html lang> and remembers the choice', () => {
        document.querySelector<HTMLElement>('[data-lang="sr"]')?.click()
        expect(document.documentElement.lang).toBe('sr-Latn')
        expect(localStorage.getItem('lang')).toBe('sr')

        document.querySelector<HTMLElement>('[data-lang="en"]')?.click()
        expect(document.documentElement.lang).toBe('en')
    })

    it('moves the address bar to the language URL and keeps the section hash', () => {
        history.replaceState(null, '', '/#skills')

        document.querySelector<HTMLElement>('[data-lang="ru"]')?.click()
        expect(location.pathname + location.hash).toBe('/ru/#skills')

        document.querySelector<HTMLElement>('[data-lang="en"]')?.click()
        expect(location.pathname + location.hash).toBe('/#skills')
    })

    it('pre-renders a language page with its head tags (used by the build)', () => {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        renderLanguage(doc, 'sr')

        expect(doc.documentElement.lang).toBe('sr-Latn')
        expect(doc.title).toBe('Maksim Kalinin — frontend programer')
        expect(doc.querySelector('[data-i18n="navHome"]')?.textContent).toBe('Početna')
        expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
            'https://mkalinin-portfolio.vercel.app/sr/',
        )
        expect(doc.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('sr_RS')
    })

    it('reflects the open state of the toggles in aria-expanded', () => {
        const switcher = document.querySelector<HTMLElement>('.lang__switcher')
        const navToggle = document.querySelector<HTMLElement>('.header-nav-toggle')

        switcher?.click()
        expect(switcher?.getAttribute('aria-expanded')).toBe('true')

        navToggle?.click()
        expect(navToggle?.getAttribute('aria-expanded')).toBe('true')
        // Opening one menu closes the other.
        expect(switcher?.getAttribute('aria-expanded')).toBe('false')

        navToggle?.click()
        expect(navToggle?.getAttribute('aria-expanded')).toBe('false')
    })

    it('closes an open menu on Escape and returns focus to its toggle', () => {
        const switcher = document.querySelector<HTMLElement>('.lang__switcher')

        switcher?.click()
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

        expect(switcher?.getAttribute('aria-expanded')).toBe('false')
        expect(document.activeElement).toBe(switcher)
    })
})
