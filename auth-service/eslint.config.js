import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked, // ✅ type-aware rules
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // ✅ tells ESLint where to get types
        tsconfigRootDir: import.meta.dirname, // ensures relative paths work
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/await-thenable': 'error',
    },
  }
);
