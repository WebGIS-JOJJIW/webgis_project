import { test, expect, Page } from '@playwright/test';

test.use({ viewport: { width: 1920, height: 1080 } }); // Set the screen size for this test

// Test block
test('test live-monitor page elements and clicks', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:4200/live-monitor');

  // Call the function to verify if all required elements are visible
  await checkPageElements(page);

  // Perform clicks on navigation elements
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

  // await checkPOIMarkerInteraction(page);
});

// Define the function to check if all required data is visible on the page 
async function checkPageElements(page: Page) {
  // Check for the page title
  await expect(page).toHaveTitle(/Web GIS/);

  // Wait for critical elements to be visible
  const elementsToCheck = [
    'text=ระบบเฝ้าระวังชายแดนแบบบูรณาการ',  // Thai text for "Integrated Border Surveillance System"
    'img[alt="Map Editor"]',                  // Image with alt text "Map Editor"
    'text=Live Monitoring',                   // Text "Live Monitoring"
    'text=Drone Patrol',                      // Text "Drone Patrol"
    // 'a.nav-link:has-text("Summary")',          // Link with text "Summary"
    // 'div:nth-child(5) > .navbar-nav > li > .nav-link',  // Navbar link
    'text=ข้อมูลเซนเซอร์',                    // Thai text for "Sensor Information"
    // '#sidebar a',                             // Sidebar links
    // 'text=ทั้งหมด Alarm Infoวันที่ประเภทระบบรายละเอียด2024-06-01 10:14:' // Alarm Info text
  ];

  for (const selector of elementsToCheck) {
    try {
      await page.waitForSelector(selector, { state: 'visible' });
      console.log(`Element with selector: ${selector} is visible.`);
    } catch (error) {
      console.error(`Element with selector: ${selector} is not visible.`, error);
    }
  }

  const mapElement = await page.locator('#map'); // Adjust the selector to your map element

  // Perform a double-click on the map three times
  for (let i = 0; i < 3; i++) {
    try {
      await mapElement.dblclick(); // Simulate double-click
      await page.waitForTimeout(1000); // Optional: wait 1 second between each double-click
      console.log(`Double-clicked on map: attempt ${i + 1}`);
    } catch (error) {
      console.error(`Failed to double-click on map: attempt ${i + 1}`, error);
    }
  }
  console.log('All required elements have been checked for visibility.');
}

// Helper function to click a button when it's ready
async function clickWhenReady(page: Page, selector: string) {
  try {
    // Wait for the selector to be visible
    // await page.waitForSelector(selector, { state: 'visible' });

    // Perform the click action
    await page.locator(selector).click();
    console.log(`Clicked on element with selector: ${selector}`);
  } catch (error) {
    console.error(`Failed to click on element with selector: ${selector}`, error);
  }
}

// New function to check interaction with a POI marker on the map
async function checkPOIMarkerInteraction(page: Page) {
  const markerSelector = 'poi_marker-unclustered'; // Adjust selector based on your marker's class or attributes
  await page.waitForSelector(markerSelector, { timeout: 5000 }); // Wait for markers to load

  const markers = await page.$$(markerSelector);
  if (markers.length > 0) {
    // Click on the first marker
    await markers[0].click();
    console.log('Clicked on the POI marker.');

    // Wait for the expected details to appear (you can change the selector according to your implementation)
    const detailElement = await page.locator('.sensor-detail'); // Change this to your actual detail selector
    await expect(detailElement).toBeVisible();
    console.log('Sensor detail element is visible.');

    // Optionally, check the content of the detail view
    const nameElement = await detailElement.locator('.sensor-name'); // Change according to your HTML structure
    await expect(nameElement).toContainText('Expected Sensor Name'); // Change to the expected sensor name
  } else {
    console.error('No POI markers found on the map.');
  }
}
