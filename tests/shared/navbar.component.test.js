describe('Shared Navbar', () => {
  jest.setTimeout(60000); 
  
  beforeAll(async () => {
    try {
      console.log('Signing in...');
      await page.goto('http://localhost:4200/sign-in', { waitUntil: 'networkidle0', timeout: 45000 });
      await page.waitForSelector('#sign-in-form-container', { visible: true, timeout: 5000 });
      await page.type('#sign-in-email', 'tibaquira@test.com');
      await page.type('#sign-in-password', '123456');
      await page.click('#sign-in-submit');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 45000 });
      console.log('Navigating to homepage...');
      await page.goto('http://localhost:4200/', { 
        waitUntil: 'networkidle0',
        timeout: 45000 
      });
      
      console.log('Waiting for basic page content...');
      await page.waitForSelector('body', { visible: true, timeout: 5000 });
      
      console.log('Waiting for toolbar...');
      await page.waitForSelector('mat-toolbar', { visible: true, timeout: 20000 });
    } catch (error) {
      console.error('Setup failed:', error.message);
      await page.screenshot({ path: 'error-screenshot.png' });
      throw error;
    }
  });

  test('should display navbar with logo and title', async () => {
    const navbar = await page.$('#shared-navbar');
    expect(navbar).toBeTruthy();

    const logo = await page.$('#shared-navbar img[alt="Logo"]');
    expect(logo).toBeTruthy();

    const title = await page.$eval('#navbar-title', el => el.textContent.trim());
    expect(title).toBe('CCP');
  }, 30000);

  test('should display navigation tabs', async () => {
    const productsTab = await page.$('#nav-products');
    const manufacturersTab = await page.$('#nav-manufacturers');
    expect(productsTab).toBeTruthy();
    expect(manufacturersTab).toBeTruthy();

    // Check their labels
    const prodLabel = await page.$eval('#nav-products', el => el.textContent.trim());
    const manLabel = await page.$eval('#nav-manufacturers', el => el.textContent.trim());
    expect(prodLabel).toContain('Products');
    expect(manLabel).toContain('Manufacturers');
  }, 30000);

  test('should navigate to Products tab on click', async () => {
    await page.click('#nav-products');
    await page.waitForFunction(
      () => window.location.pathname.includes('/products'),
      { timeout: 30000 }
    );
    expect(page.url()).toContain('/products');
  }, 30000);

  test('should navigate to Manufacturers tab on click', async () => {
    await page.click('#nav-manufacturers');
    await page.waitForFunction(
      () => window.location.pathname.includes('/manufacturers'),
      { timeout: 30000 }
    );
    expect(page.url()).toContain('/manufacturers');
  }, 30000);
});