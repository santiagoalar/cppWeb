describe('Sign-Up Component', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:4200/sign-up');
    await page.waitForSelector('.auth-container');
  });

  test('should display sign-up form', async () => {
    await page.waitForSelector('.auth-container');
    
    const usernameInput = await page.$('#sign-up-username');
    const emailInput = await page.$('#sign-up-email');
    const submitButton = await page.$('#sign-up-submit');
    const signInLink = await page.$('#sign-up-to-sign-in');
    
    expect(usernameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(signInLink).toBeTruthy();
  });

  test('should navigate to sign-in page', async () => {
    const currentUrl = page.url();
    await page.click('#sign-up-to-sign-in');
    await page.waitForFunction(
      url => window.location.href !== url,
      {},
      currentUrl
    );
    expect(page.url()).toContain('/sign-in');
  });
  test('submit button is disabled when form is invalid', async () => {
    const isDisabled = await page.$eval('#sign-up-submit', btn => btn.disabled);
    expect(isDisabled).toBe(true);
  });

  test('submit button is enabled when form is valid', async () => {
    await page.type('#sign-up-username', 'TestUser');
    await page.type('#sign-up-phone', '1234567890');
    await page.click('#sign-up-role');
    await page.click('mat-option[value="CLIENTE"]');
    await page.type('#sign-up-email', 'testuser@example.com');
    await page.type('#sign-up-password', 'password123');
    const isDisabled = await page.$eval('#sign-up-submit', btn => btn.disabled);
    expect(isDisabled).toBe(false);
  });
});