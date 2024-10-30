import { test, expect, Page } from '@playwright/test';

test.use({ viewport: { width: 1920, height: 1080 } }); // Set the screen size for this test

// Test block
test('test live-monitor page elements and clicks', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:4200/live-monitor');

  // Call the function to verify if all required elements are visible
  await checkTitleElements(page);

  // Perform clicks on navigation elements
  await checkButtonElements(page);

  // Unit tests map component 
  await checkMapElements(page);
});

async function checkButtonElements(page: Page) {
  await clickWhenReady(page, 'text=Live Monitoring');
  await clickWhenReady(page, 'text=Drone Patrol');
  await clickWhenReady(page, 'a.nav-link:has-text("Summary")');
  await page.locator('#sidebar a').nth(1).click();
  await page.locator('#sidebar a').nth(2).click();
  await page.locator('#sidebar a').nth(3).click();
  await page.locator('#sidebar a').nth(4).click();
  await page.locator('div:nth-child(5) > .navbar-nav > li:nth-child(2) > .nav-link').click();
  await page.locator('div:nth-child(5) > .navbar-nav > li:nth-child(3) > .nav-link').click();
  await page.locator('li:nth-child(4) > .nav-link').first().click();

}

async function checkMapElements(page: Page) {
  
  // await page.getByLabel('Zoom out').click();

  for (var i = 0; i< 2; i++ ){
    await page.getByLabel('Zoom out').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Zoom out').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Map').click({
      position: {
        x: 682,
        y: 277
      }
    });
    const sensor1Locator = page.getByText('ข้อมูลเซนเซอร์ (sensor1)');
    await sensor1Locator.waitFor({ timeout: 3000 });
    await sensor1Locator.click();
;
  
    await page.waitForTimeout(2000);
    await page.getByLabel('Map').click({
      position: {
        x: 624,
        y: 435
      }
    });
    const sensor2Locator = page.getByText('ข้อมูลเซนเซอร์ (sensor2)');
    await sensor2Locator.waitFor({ timeout: 3000 });
    await sensor2Locator.click();
    await page.waitForTimeout(1000);

    // await page.getByLabel('Zoom in').click();
    await page.getByLabel('Zoom in').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Zoom in').click();
    await page.waitForTimeout(1000);
    await page.locator('#map').getByRole('img').click();
    await page.waitForTimeout(2000);
  }

  await page.getByLabel('Map').click({
    position: {
      x: 604,
      y: 229
    }
  });

  await page.mouse.move(600, 300);
  await page.mouse.down();
  await page.mouse.move(1200, 450, {steps: 50});  // <-- Change here
  await page.mouse.up();
  await page.waitForTimeout(2000);
}

// Define the function to check if all required data is visible on the page 
async function checkTitleElements(page: Page) {
  // Check for the page title
  await expect(page).toHaveTitle(/Web GIS/);

  // Wait for critical elements to be visible
  const elementsToCheck = [
    'text=ระบบเฝ้าระวังชายแดนแบบบูรณาการ',  // Thai text for "Integrated Border Surveillance System"
    'img[alt="Map Editor"]',                  // Image with alt text "Map Editor"
    'text=Live Monitoring',                   // Text "Live Monitoring"
    'text=Drone Patrol',                      // Text "Drone Patrol"
    'text=ข้อมูลเซนเซอร์',                    // Thai text for "Sensor Information"
  ];

  for (const selector of elementsToCheck) {
    try {
      await page.waitForSelector(selector, { state: 'visible' });
      console.log(`Element with selector: ${selector} is visible.`);
    } catch (error) {
      console.error(`Element with selector: ${selector} is not visible.`, error);
    }
  }
  console.log('All required elements have been checked for visibility.');
}

// Helper function to click a button when it's ready
async function clickWhenReady(page: Page, selector: string) {
  try {

    // Perform the click action
    await page.locator(selector).click();
    console.log(`Clicked on element with selector: ${selector}`);
  } catch (error) {
    console.error(`Failed to click on element with selector: ${selector}`, error);
  }
}
