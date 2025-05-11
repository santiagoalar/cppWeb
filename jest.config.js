module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/base-test.js'],
  testTimeout: 30000,
  verbose: true
};