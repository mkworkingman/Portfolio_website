import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        eqeqeq: 'error',
        'no-console': 'warn',
    },
})
