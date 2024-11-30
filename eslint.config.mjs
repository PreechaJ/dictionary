import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Browser-specific globals
        ...globals.node, // Node.js globals (includes process, etc.)
        ...globals.jest, // Jest globals (includes jest, describe, test, etc.)
      },
    },
  },
  pluginJs.configs.recommended,
];
