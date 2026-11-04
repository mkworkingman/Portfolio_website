import js from '@eslint/js'
import html from '@html-eslint/eslint-plugin'
import htmlParser from '@html-eslint/parser'
import tseslint from 'typescript-eslint'

const CLICK_MESSAGE =
    'Clicks go through event delegation in src/scripts/clickHandler.ts (see CLAUDE.md / .claude/rules/scripts.md).'

export default tseslint.config(
    {
        files: ['**/*.{js,ts}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            eqeqeq: 'error',
            'no-console': 'warn',
        },
    },
    {
        files: ['src/scripts/**/*.ts'],
        ignores: ['src/scripts/clickHandler.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        "CallExpression[callee.property.name='addEventListener'][arguments.0.value='click']",
                    message: CLICK_MESSAGE,
                },
                {
                    selector: "AssignmentExpression[left.property.name='onclick']",
                    message: CLICK_MESSAGE,
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        plugins: { '@html-eslint': html },
        languageOptions: { parser: htmlParser },
        rules: {
            '@html-eslint/require-lang': 'error',
            '@html-eslint/require-img-alt': 'error',
            '@html-eslint/require-button-type': 'error',
            '@html-eslint/require-meta-viewport': 'error',
            '@html-eslint/require-input-label': 'error',
            '@html-eslint/require-frame-title': 'error',
            '@html-eslint/no-duplicate-id': 'error',
            '@html-eslint/no-duplicate-attrs': 'error',
            '@html-eslint/no-positive-tabindex': 'error',
            '@html-eslint/no-skip-heading-levels': 'error',
            '@html-eslint/no-multiple-h1': 'error',
            '@html-eslint/no-aria-hidden-on-focusable': 'error',
            '@html-eslint/no-invalid-role': 'error',
            '@html-eslint/no-nested-interactive': 'error',
            '@html-eslint/no-non-scalable-viewport': 'error',
            '@html-eslint/no-inline-styles': 'error',
            '@html-eslint/no-restricted-attrs': [
                'error',
                {
                    tagPatterns: ['.*'],
                    attrPatterns: ['^on.*'],
                    message: CLICK_MESSAGE + ' No inline event handlers (CSP).',
                },
            ],
        },
    },
)
