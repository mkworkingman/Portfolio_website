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
        const langElements = Array.from(document.querySelectorAll<HTMLElement>('[data-lang]'))
        const langValues = langElements.map((el) => el.dataset.lang)

        const expected = [...LANGUAGES].sort()
        const actual = langValues.sort()

        expect(actual).toEqual(expected)
    })

    it('contains exactly one data-i18n element for each text key, no duplicates', () => {
        const i18nElements = Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'))
        const i18nValues = i18nElements.map((el) => el.dataset.i18n)

        const expected = [...TEXT_KEYS].sort()
        const actual = i18nValues.sort()

        expect(actual).toEqual(expected)
    })

    //TODO: unique IDs, all hrefs go to the IDs
})

describe('Runtime', () => {
    it('applies English translations on load', () => {
        const homeLink = document.querySelector<HTMLElement>('[data-i18n="navHome"]')
        expect(homeLink?.textContent).toBe('Home')
    })

    it('switches language when a lang item is clicked (event delegation check)', () => {
        const ruItem = document.querySelector<HTMLElement>('[data-lang="ru"]')
        if (!ruItem) throw new Error('RU item not found')

        ruItem.click()

        const homeLink = document.querySelector<HTMLElement>('[data-i18n="navHome"]')
        expect(homeLink?.textContent).toBe('Главная')
    })
})
