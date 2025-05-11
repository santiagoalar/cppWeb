describe('Sign-In Component', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:4200/sign-in');
    await page.waitForSelector('#sign-in-form-container');
  });

  test('should display sign-in form', async () => {
    const emailInput = await page.$('#sign-in-email');
    const passwordInput = await page.$('#sign-in-password');
    const submitButton = await page.$('#sign-in-submit');
    const signUpLink = await page.$('#go-to-sign-up');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(signUpLink).toBeTruthy();
  });

  test('should navigate to sign-up page', async () => {
    const currentUrl = page.url();
    await page.click('#go-to-sign-up');
    await page.waitForFunction(
      url => window.location.href !== url,
      {},
      currentUrl
    );
    expect(page.url()).toContain('/sign-up');
  });

  test('should sign in with valid credentials and navigate to main page', async () => {
    await page.type('#sign-in-email', 'tibaquira@test.com');
    await page.type('#sign-in-password', '123456');
    await page.click('#sign-in-submit');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
    expect(page.url()).toBe('http://localhost:4200/main-page');
    await page.waitForSelector('#main-page-container', { timeout: 30000 });
    expect(await page.$('#main-page-container')).toBeTruthy();
  });
});