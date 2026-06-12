/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
const lintStagedConfig = {
  'src/**/*.{js,jsx,ts,tsx}': 'eslint --fix',
};

export default lintStagedConfig;
