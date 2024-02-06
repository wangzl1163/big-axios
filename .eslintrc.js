module.exports = {
   root: true,
   env: {
      browser: true,
      node: true,
      es2024: true
   },
   extends: ['eslint:recommended', 'prettier', 'plugin:@typescript-eslint/recommended'],
   plugins: ['@typescript-eslint'],
   parser: '@typescript-eslint/parser',
   rules: {
      'no-tabs': ['error', { allowIndentationTabs: true }],
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
   }
};
