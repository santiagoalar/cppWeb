const timeout = 30000;

describe('Main Page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4200/sign-in');
    await page.waitForSelector('#sign-in-form-container', { timeout });
    await page.type('#sign-in-email', 'tibaquira@test.com');
    await page.type('#sign-in-password', '123456');
    await page.click('#sign-in-submit');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
    await page.goto('http://localhost:4200/');
    await page.waitForSelector('#main-page-container', { timeout });
  }, timeout);

  test('debería mostrar el contenedor principal', async () => {
    const container = await page.$('#main-page-container');
    expect(container).toBeTruthy();
  }, timeout);

  test('debería mostrar el título de la página', async () => {
    const title = await page.$eval('#main-page-title', el => el.textContent.trim());
    expect(title).toBe('Welcome to Our Website!');
  }, timeout);
});