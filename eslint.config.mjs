// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // ── Base ──────────────────────────────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ── Prettier disables conflicting formatting rules ─────────────────────────
  prettier,

  // ── Global ignores ─────────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'allure-report/**',
      'allure-results/**',
      'test-results/**',
    ],
  },

  // ── Project rules ──────────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',

      // General
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },

  // ── Relaxed rules for test files ───────────────────────────────────────────
  {
    files: ['tests/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
);
