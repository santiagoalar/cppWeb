module.exports = {
  launch: {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 50,
    timeout: 60000,
    dumpio: true
  },
  browserContext: 'default'
}