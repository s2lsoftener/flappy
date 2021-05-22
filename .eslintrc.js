module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      emcaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    ignorePatterns: ['.eslintrc.js', 'webpack.config.js', '.prettierrc.js']
  }