'use strict';

module.exports = {
  env: {
    browser: true,
    commonjs: false,
    es2023: true
  },
  extends: [
    'airbnb-base/legacy',
    //'prettier'
  ],
  overrides: [],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        '@babel/plugin-syntax-import-assertions'
      ],
    },
		ecmaVersion: 2023,
  },
  rules: {
    strict: ['error', 'global'],
    'no-eval': 'off',
    'new-cap': 'off',
    'no-promise-executor-return': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'client|msg'
      }
    ],
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'global-require': 'off',
    'no-unused-expressions': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'no-param-reassign': 'off',
    'no-global-assign': 'off',
    "no-unsafe-optional-chaining": "off",
    "consistent-return": "off"
  },
  globals: {
    pb: 'readonly',
    spamInterval: 'writable',
    sendNotification: 'writable',
    client: 'writable',
    Logger: 'readonly',
    LogLevel: 'readonly',
    upload: 'readonly',
    devmode: 'readonly',
    listenForJoins: 'readonly',
    failedJoin: 'readonly',
    maintenanceMode: 'readonly', 
    pubsubCount: 'readonly'
  }
};
