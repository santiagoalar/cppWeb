const timeout = 30000;

describe('Products Module', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:4200/sign-in', { waitUntil: 'networkidle0', timeout });
        await page.waitForSelector('#sign-in-form-container', { visible: true, timeout });
        await page.type('#sign-in-email', 'tibaquira@test.com');
        await page.type('#sign-in-password', '123456');
        await page.click('#sign-in-submit');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
        expect(page.url()).toBe('http://localhost:4200/main-page');
        await page.waitForSelector('#main-page-container', { timeout: 30000 });
        expect(await page.$('#main-page-container')).toBeTruthy();

        await page.waitForSelector('#nav-products', { visible: true, timeout });
        await page.click('#nav-products');
        await page.waitForFunction(
            () => window.location.pathname.includes('/products'),
            { timeout }
        );
        await page.waitForSelector('.products-container', { visible: true, timeout });
        console.log('Products module loaded');
    }, timeout);

    test('should display products page title and action buttons', async () => {
        const title = await page.$eval('.page-title', el => el.textContent.trim());
        expect(title).toMatch(/Products/i);

        const createBtn = await page.$('#create-product-button');
        expect(createBtn).toBeTruthy();

        const bulkUploadBtn = await page.$('#bulk-upload-button');
        expect(bulkUploadBtn).toBeTruthy();
    }, timeout);

    test('should display list of product cards', async () => {
        const cards = await page.$$('.product-card');
        expect(cards.length).toBeGreaterThan(0);
    }, timeout);

    test('should open create product modal', async () => {
        await page.click('#create-product-button');
        await page.waitForSelector('.product-form', { visible: true, timeout });
        const nameVal = await page.$eval('#product-name-input', el => el.value);
        expect(nameVal).toBe('');
        await page.click('#cancel-product-button');
        await page.waitForSelector('.product-form', { hidden: true, timeout });
    }, timeout);

    test('should open bulk upload modal', async () => {
        await page.click('#bulk-upload-button');

        await page.waitForSelector('#bulk-upload-content', { visible: true, timeout });

        const title = await page.$eval('#bulk-upload-title', el => el.textContent.trim());
        expect(title).toContain('Bulk Upload');

        const dropzone = await page.$('#file-dropzone');
        expect(dropzone).toBeTruthy();

        const dropzoneHint = await page.$eval('#dropzone-hint', el => el.textContent);
        expect(dropzoneHint).toBeTruthy();

        const uploadInfoText = await page.$eval('#upload-info', el => el.textContent);
        expect(uploadInfoText).toContain('CSV');

        const downloadButton = await page.$('#download-template-button');
        expect(downloadButton).toBeTruthy();

        const submitButton = await page.$('#bulk-upload-submit-button');
        expect(submitButton).toBeTruthy();
        expect(await page.evaluate(el => el.disabled, submitButton)).toBe(true);

        await page.click('#bulk-upload-close-button');

        await page.waitForSelector('#bulk-upload-content', { hidden: true, timeout });
    }, timeout);

    test('should open edit modal for first product', async () => {
        const editButtons = await page.$$('button[id^="product-edit-"]');
        expect(editButtons.length).toBeGreaterThan(0);
        await editButtons[0].click();
        await page.waitForSelector('.product-form', { visible: true, timeout });
        const populatedName = await page.$eval('#product-name-input', el => el.value);
        expect(populatedName).not.toBe('');
        await page.click('#cancel-product-button');
        await page.waitForSelector('.product-form', { hidden: true, timeout });
    }, timeout);

    test('should open details modal for first product and navigate images', async () => {
        const detailsButtons = await page.$$('button[id^="product-details-"]');
        expect(detailsButtons.length).toBeGreaterThan(0);
        await detailsButtons[0].click();

        await page.waitForSelector('#product-details-info', { visible: true, timeout });

        await page.click('#modal-next-image');
        await page.click('#modal-prev-image');

        await page.click('#modal-close-button');
        await page.waitForSelector('#product-details-info', { hidden: true, timeout });
    }, timeout);
});