const timeout = 30000;

describe('Orders Module', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:4200/sign-in', { waitUntil: 'networkidle0', timeout });
        await page.waitForSelector('#sign-in-form-container', { visible: true, timeout });
        await page.type('#sign-in-email', 'tibaquira@test.com');
        await page.type('#sign-in-password', '123456');
        await page.click('#sign-in-submit');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
        expect(page.url()).toBe('http://localhost:4200/main-page');
        await page.waitForSelector('#main-page-container', { timeout });
        expect(await page.$('#main-page-container')).toBeTruthy();

        await page.waitForSelector('#nav-orders', { visible: true, timeout });
        await page.click('#nav-orders');
        await page.waitForFunction(
            () => window.location.pathname.includes('/orders'),
            { timeout }
        );
        await page.waitForSelector('#orders-main-container', { visible: true, timeout });
    }, timeout);

    test('should display orders page title', async () => {
        const title = await page.$eval('#orders-title', el => el.textContent.trim());
        expect(title).toMatch(/Orders/i);
    }, timeout);

    test('should display orders table with header columns', async () => {
        try {
            await page.waitForSelector('#orders-table', { visible: true, timeout: 5000 });
            
            const idHeader = await page.$eval('#orders-id-header', el => el.textContent.trim());
            const dateHeader = await page.$eval('#orders-date-header', el => el.textContent.trim());
            const statusHeader = await page.$eval('#orders-status-header', el => el.textContent.trim());
            const transactionHeader = await page.$eval('#orders-transaction-status-header', el => el.textContent.trim());
            const clientHeader = await page.$eval('#orders-client-header', el => el.textContent.trim());
            const totalHeader = await page.$eval('#orders-total-header', el => el.textContent.trim());
            
            expect(idHeader).toBeTruthy();
            expect(dateHeader).toBeTruthy();
            expect(statusHeader).toBeTruthy();
            expect(transactionHeader).toBeTruthy();
            expect(clientHeader).toBeTruthy();
            expect(totalHeader).toBeTruthy();
        } catch (e) {
            const hasNoData = await page.$('#orders-no-data') !== null;
            if (!hasNoData) {
                throw e;
            }
        }
    }, timeout);

    test('should show order details when clicking view button', async () => {
        try {
            const hasTable = await page.$('#orders-table') !== null;
            if (!hasTable) {
                const hasNoData = await page.$('#orders-no-data') !== null;
                if (hasNoData) return;
            }
            
            const rows = await page.$$('tr[id^="order-row-"]');
            if (rows.length === 0) return;
            
            const viewButton = await rows[0].$('button[id^="view-order-"]');
            if (!viewButton) return;
            
            await viewButton.click();
            await page.waitForSelector('#order-details-container', { visible: true, timeout: 5000 });
            
            const generalInfoExists = await page.$('#general-info-card') !== null;
            expect(generalInfoExists).toBeTruthy();
            
            const clientField = await page.$('#client-input');
            expect(clientField).toBeTruthy();
            
            await page.click('#close-order-details-button');
            await page.waitForSelector('#order-details-container', { hidden: true, timeout: 5000 });
        } catch (e) {
            await page.screenshot({ path: 'error-order-details.png' });
            throw e;
        }
    }, timeout);

    test('should display order history if available', async () => {
        try {
            const rows = await page.$$('tr[id^="order-row-"]');
            if (rows.length === 0) return;
            
            const viewButton = await rows[0].$('button[id^="view-order-"]');
            if (!viewButton) return;
            
            await viewButton.click();
            await page.waitForSelector('#order-details-container', { visible: true, timeout: 5000 });
            
            const hasHistoryCard = await page.$('#history-card') !== null;
            
            if (hasHistoryCard) {
                const hasHistoryTable = await page.$('#history-table') !== null;
                expect(hasHistoryTable).toBeTruthy();
                
                const dateHeader = await page.$('#history-date-header');
                const statusHeader = await page.$('#history-status-header');
                
                expect(dateHeader).toBeTruthy();
                expect(statusHeader).toBeTruthy();
            }
            
            await page.click('#close-order-details-button');
        } catch (e) {
            await page.screenshot({ path: 'error-order-history.png' });
            throw e;
        }
    }, timeout);

    test('should display order items cards in details modal', async () => {
        try {
            const rows = await page.$$('tr[id^="order-row-"]');
            if (rows.length === 0) return;
            
            const viewButton = await rows[0].$('button[id^="view-order-"]');
            if (!viewButton) return;
            
            await viewButton.click();
            await page.waitForSelector('#order-details-container', { visible: true, timeout: 5000 });
            
            const itemsCardExists = await page.$('#order-items-card') !== null;
            expect(itemsCardExists).toBeTruthy();
            
            const hasItemsGrid = await page.$('#order-items-grid') !== null;
            if (!hasItemsGrid) {
                await page.click('#close-order-details-button');
                return;
            }
            
            const productCards = await page.$$('[id^="product-card-"]');
            
            if (productCards.length > 0) {
                const hasTitle = await page.$('[id^="product-title-"]') !== null;
                expect(hasTitle).toBeTruthy();
                
                const hasPrice = await page.$('[id^="product-price-"]') !== null;
                expect(hasPrice).toBeTruthy();
                
                const hasQuantity = await page.$('[id^="product-quantity-"]') !== null;
                expect(hasQuantity).toBeTruthy();
            }
            
            await page.click('#close-order-details-button');
        } catch (e) {
            await page.screenshot({ path: 'error-order-items.png' });
            throw e;
        }
    }, timeout);
});