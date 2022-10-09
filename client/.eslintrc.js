module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  ignorePatterns: [
    'jest.config.ts',
    '.husky',
    '/coverage',
    '/node_modules',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx', '.ts'] },
    ],
    'jsx-a11y/anchor-is-valid': 'off',
    'arrow-body-style': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        '': 'never',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.{ts,tsx}', 'src/setupTests.js'],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Field'],
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'no-restricted-imports': [
      'error',
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
