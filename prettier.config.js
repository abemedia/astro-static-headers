/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  proseWrap: 'always',
  overrides: [{ files: 'pnpm-lock.yaml', options: { rangeEnd: 0 } }], // Ignore lock file.
};
