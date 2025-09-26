// eslint.config.mjs
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginCypress from 'eslint-plugin-cypress';

export default [
  // Cypress test files
  {
    files: ['cypress/**/*.ts', 'cypress/**/*.spec.ts', 'cypress/**/*.cy.{js,jsx,ts,tsx}'],
    plugins: {
      cypress: pluginCypress,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Cypress recommended rules
      ...pluginCypress.configs.recommended.rules,
      // TypeScript recommended rules
      ...tsPlugin.configs.recommended.rules,
      // Custom overrides
      '@typescript-eslint/no-unused-vars': 'warn',
      'cypress/no-unnecessary-waiting': 'warn',
    },
    languageOptions: {
      parser: tsParser, // <-- must be imported object, not string
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
  },

  // Application code (optional)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    languageOptions: {
      parser: tsParser, // <-- imported parser
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];