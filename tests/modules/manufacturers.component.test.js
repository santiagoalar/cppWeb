const timeout = 30000;

describe('Manufacturers Module', () => {
    beforeEach(async () => {
        // Sign in
        await page.goto('http://localhost:4200/sign-in', { waitUntil: 'networkidle0', timeout });
        await page.waitForSelector('#sign-in-form-container', { visible: true, timeout });
        await page.type('#sign-in-email', 'tibaquira@test.com');
        await page.type('#sign-in-password', '123456');
        await page.click('#sign-in-submit');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
        expect(page.url()).toBe('http://localhost:4200/main-page');
        await page.waitForSelector('#main-page-container', { timeout: 30000 });
        expect(await page.$('#main-page-container')).toBeTruthy();

        await page.waitForSelector('#nav-manufacturers', { visible: true, timeout });
        await page.click('#nav-manufacturers');
        await page.waitForFunction(
            () => window.location.pathname.includes('/manufacturers'),
            { timeout }
        );
        await page.waitForSelector('.manufacturers-container', { visible: true, timeout });
    }, timeout);

    test('should display manufacturers page title and create button', async () => {
        const title = await page.$eval('.page-title', el => el.textContent.trim());
        expect(title).toMatch(/Manufacturers/i);
        const createBtn = await page.$('#create-manufacturer-button');
        expect(createBtn).toBeTruthy();
    }, timeout);

    test('should display list of manufacturers', async () => {
        const loadingIndicator = await page.$('.mat-progress-spinner');
        if (loadingIndicator) {
            await page.waitForFunction(
                () => !document.querySelector('.mat-progress-spinner'),
                { timeout }
            );
        }

        const rows = await page.$$('table tr.mat-row, table tr.mat-mdc-row');
        expect(rows.length).toBeGreaterThan(0);
    }, timeout);

    test('should open edit modal for first manufacturer', async () => {
        // Verify there's at least one row
        const rows = await page.$$('table tr.mat-row, table tr.mat-mdc-row');
        expect(rows.length).toBeGreaterThan(0);
        const firstRow = rows[0];

        // Click the edit button in the first row
        const editBtn = await firstRow.$('button');
        expect(editBtn).toBeTruthy();
        await editBtn.click();

        await page.waitForSelector('.manufacturer-modal-form', { visible: true, timeout });
        const nameVal = await page.$eval('#manufacturer-name-input', el => el.value);
        expect(nameVal).not.toBe('');

        await page.click('#cancel-manufacturer-button');
        await page.waitForSelector('.manufacturer-modal-form', { hidden: true, timeout });
    }, timeout);

    test('should open create manufacturer modal', async () => {
        await page.click('#create-manufacturer-button');
        await page.waitForSelector('.manufacturer-modal-form', { visible: true, timeout });
        const nameVal = await page.$eval('#manufacturer-name-input', el => el.value);
        expect(nameVal).toBe('');
        await page.click('#cancel-manufacturer-button');
        await page.waitForSelector('.manufacturer-modal-form', { hidden: true, timeout });
    }, timeout);
});