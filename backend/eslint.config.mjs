import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores([
        'node_modules',
        'dist',
        'coverage',
        '.env',
    ]),

    {
        files: ['**/*.js'],
        extends: [js.configs.recommended],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',

            globals: {
                ...globals.node,
            },
        },

        rules: {
            // Ignore intentionally unused vars like _req
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            // Good backend practices
            'no-console': 'off',
            'no-undef': 'error',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },

    {
        files: ['test/**/*.js'],

        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
])