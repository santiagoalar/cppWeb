const timeout = 30000;

describe('Language Switcher', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4200/');
    await page.waitForSelector('#language-switcher');
  });

  test('should display current language button', async () => {
    const button = await page.$('#language-button');
    expect(button).toBeTruthy();
  });
});