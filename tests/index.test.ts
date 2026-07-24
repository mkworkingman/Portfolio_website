import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { LANGUAGES, TEXT_KEYS } from '../src/scripts/values'

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

    it('contains exactly one data-i18n element for each text key, no duplicates', () => {
        const i18nValues = [...document.querySelectorAll<HTMLElement>('[data-i18n]')].map(
            (el) => el.dataset.i18n,
        )

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

    it('has no duplicate ids', () => {
        const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
        expect(ids.length === new Set(ids).size).toBe(true)
    })
})

describe('Runtime', () => {
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
})
