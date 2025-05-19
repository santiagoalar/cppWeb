beforeAll(async () => {
  await page.setDefaultNavigationTimeout(30000);
  await page.setDefaultTimeout(30000);

  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  page.on('pageerror', error => console.error('PAGE ERROR:', error));
});

afterAll(async () => {
  console.log('Test teardown completed');
});