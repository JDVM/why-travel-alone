import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Replaces the checks create-react-app ran during builds: JavaScript and
// TypeScript mistakes, the rules of hooks, and accessibility. CI fails on any
// warning (npm run lint uses --max-warnings=0).
export default tseslint.config(
    { ignores: ['build', 'node_modules', 'playwright-report', 'test-results'] },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            globals: { ...globals.browser },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true, allowExportNames: ['useAuth'] }],
            // Unused variables are errors, except deliberately ignored rest siblings.
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, args: 'none' }],
            // The API layer types raw JSON loosely before normalizing it.
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', 'src/setupTests.ts'],
        languageOptions: { globals: { ...globals.node, ...globals.vitest } },
    },
    {
        files: ['e2e/**', 'playwright.config.ts', 'vite.config.ts', 'eslint.config.js'],
        languageOptions: { globals: { ...globals.node } },
    }
);
