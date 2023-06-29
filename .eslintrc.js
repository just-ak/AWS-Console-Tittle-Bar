// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 132,
        arrowParens: 'always',
        semi: true,
        tabWidth: 2,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    'promise/catch-or-return': 'error',
    // 'promise/no-nesting': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'error',

    // Not Used
    // "promise/prefer-await-to-then": "error"
    // "promise/always-return": "error",
  },
};
