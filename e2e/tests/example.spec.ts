import { test, expect, Page } from '@playwright/test';

test.use({ viewport: { width: 1920, height: 1080 } }); // Set the screen size for this test

// Test block
test('get started link', async ({ page }) => {
  await page.goto('http://localhost:4200/live-monitor');

  // Call the function to verify if all required elements are visible
  await checkPageElements(page);

  // Example usage of the function
  await clickWhenReady(page, 'text=Live Monitoring');
  await clickWhenReady(page, 'text=Drone Patrol');
  await clickWhenReady(page, 'text=Summary');
  await clickWhenReady(page, 'div:nth-child(5) > .navbar-nav > li > .nav-link');
  await clickWhenReady(page, 'div:nth-child(5) > .navbar-nav > li:nth-child(2) > .nav-link');
  await clickWhenReady(page, 'div:nth-child(5) > .navbar-nav > li:nth-child(3) > .nav-link');
  await clickWhenReady(page, '#sidebar a:nth-child(1)');
  await clickWhenReady(page, '#sidebar a:nth-child(2)');
  await clickWhenReady(page, '#sidebar a:nth-child(3)');
  await clickWhenReady(page, '#sidebar a:nth-child(4)');

  // Additional actions or assertions can be added below
});

// Define the function to check if all required data is visible on the page
async function checkPageElements(page: Page) {
  // Check for the page title
  await expect(page).toHaveTitle(/Web GIS/);

  // Check for the visibility of the specific elements
  await page.waitForSelector('text=ระบบเฝ้าระวังชายแดนแบบบูรณาการ', { state: 'visible' });
  await page.waitForSelector('img[alt="Map Editor"]', { state: 'visible' });
  await page.waitForSelector('text=Live Monitoring', { state: 'visible' });
  await page.waitForSelector('text=Drone Patrol', { state: 'visible' });
  await page.waitForSelector('text=Summary', { state: 'visible' });
  await page.waitForSelector('div:nth-child(5) > .navbar-nav > li > .nav-link', { state: 'visible' });

  // Check for sensor information heading
  await page.waitForSelector('text=ข้อมูลเซนเซอร์', { state: 'visible' });

  // Check for the sidebar links
  await page.waitForSelector('#sidebar a', { state: 'visible' });

  // Check for other elements if necessary
  await page.waitForSelector('text=ทั้งหมด Alarm Infoวันที่ประเภทระบบรายละเอียด2024-06-01 10:14:', { state: 'visible' });

  const mapElement = await page.locator('#map'); // Replace '#map' with the correct selector for the map container

  // Perform a double-click on the map three times
  for (let i = 0; i < 3; i++) {
    await mapElement.dblclick(); // Simulate double-click
    await page.waitForTimeout(1000); // Optional: wait 1 second between each double-click
  }

  console.log('All required elements are visible on the page.');
}

// Helper function to click a button when it's ready
async function clickWhenReady(page: Page, selector: string) {
  const element = await page.locator(selector);

  // Wait for the button to be available in the DOM and enabled
  await element.waitFor({ state: 'visible' });

  // Check if the button is enabled before clicking
  const isEnabled = await element.isEnabled();

  if (isEnabled) {
    await element.click();
    console.log(`Clicked on element with selector: ${selector}`);
  } else {
    console.log(`Element with selector: ${selector} is not enabled or clickable.`);
  }
}
