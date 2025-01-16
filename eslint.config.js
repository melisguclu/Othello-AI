import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier'; // Prettier entegrasyonu
import pluginPrettier from 'eslint-plugin-prettier'; // Prettier kurallarını uygulamak için

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier, // Prettier eklentisi
    },
    rules: {
      ...pluginPrettier.rules, // Prettier kuralları
      'prettier/prettier': 'error', // Prettier hatalarını ESLint hatası olarak gösterir
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier, // Prettier ile çakışmayı önler
];
