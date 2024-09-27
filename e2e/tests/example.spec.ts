import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('http://localhost:4200/live-monitor');

//   // Expect a title "to contain" a substring.
  
// });
test.use({ viewport: { width: 1920, height: 1080 } }); // ตั้งค่าขนาดหน้าจอสำหรับการทดสอบนี้


test('get started link', async ({ page }) => {
  await page.goto('http://localhost:4200/live-monitor');

  await expect(page).toHaveTitle(/Web GIS/);
  // await page.waitForSelector('text=ระบบเฝ้าระวังชายแดนแบบบูรณาการ', { state: 'visible' });
  // await page.getByText('ระบบเฝ้าระวังชายแดนแบบบูรณาการ').click();

  // await page.waitForSelector('img[alt="Map Editor"]', { state: 'visible' });
  // await page.getByRole('img', { name: 'Map Editor' }).first().click();

  // await page.waitForSelector('text=Live Monitoring', { state: 'visible' });
  // await page.getByText('Live Monitoring').click();

  // await page.waitForSelector('text=Drone Patrol', { state: 'visible' });
  // await page.getByText('Drone Patrol').click();

  // await page.waitForSelector('text=Summary', { state: 'visible' });
  // // await page.getByText('Summary').click();

  // await page.waitForSelector('div:nth-child(5) > .navbar-nav > li > .nav-link', { state: 'visible' });
  // await page.locator('div:nth-child(5) > .navbar-nav > li > .nav-link').first().click();

  // await page.waitForSelector('div:nth-child(5) > .navbar-nav > li:nth-child(2) > .nav-link', { state: 'visible' });
  // await page.locator('div:nth-child(5) > .navbar-nav > li:nth-child(2) > .nav-link').click();

  // await page.waitForSelector('div:nth-child(5) > .navbar-nav > li:nth-child(3) > .nav-link', { state: 'visible' });
  // await page.locator('div:nth-child(5) > .navbar-nav > li:nth-child(3) > .nav-link').click();

  // await page.waitForSelector('li:nth-child(4) > .nav-link', { state: 'visible' });
  // await page.locator('li:nth-child(4) > .nav-link').first().click();

  // await page.waitForSelector('text=Live Monitoring', { state: 'visible' });
  // await page.getByText('Live Monitoring').click();

  // await page.waitForSelector('#sidebar a', { state: 'visible' });
  // await page.locator('#sidebar a').first().click();
  // await page.locator('#sidebar a').nth(1).click();
  // await page.locator('#sidebar a').nth(2).click();
  // await page.locator('#sidebar a').nth(3).click();
  // await page.locator('#sidebar a').nth(4).click();

  // await page.waitForSelector('text=ทั้งหมด Alarm Infoวันที่ประเภทระบบรายละเอียด2024-06-01 10:14:', { state: 'visible' });
  // await page.getByRole('heading', { name: 'Sensor' }).click();
  // await page.waitForSelector('text=เหตุการณ์ (Last 12 hrs):', { state: 'visible' });
  // await page.waitForSelector('text=Human: 2Vehicle: 3Other:', { state: 'visible' });
  // await page.waitForSelector('text=สถานะอุปกรณ์: Good20 min ago', { state: 'visible' });
  // await page.waitForSelector('h1:has-text("ภาพถ่ายที่บันทึก")', { state: 'visible' });
  // await page.waitForSelector('text=Latest: 2024-06-01 12:', { state: 'visible' });
  // await page.waitForSelector('img[alt="latest image"]', { state: 'visible' });
  // await page.waitForSelector('img[alt="-06-01 10:00"]', { state: 'visible' });
  // await page.waitForSelector('img[alt="-05-31 22:00"]', { state: 'visible' });
  // await page.waitForSelector('text=By: S001.A', { state: 'visible' });
  // await page.waitForSelector('text=By: S001.B', { state: 'visible' });
  // await page.waitForSelector('h1:has-text("Trigger Summary")', { state: 'visible' });
  // await page.waitForSelector('text=Trigger SummaryLog', { state: 'visible' });
  // await page.waitForSelector('label[for="Map"]', { state: 'visible' });
  await page.getByLabel('Map').click({
    position: {
      x: 785,
      y: 102
    }
  });
  // const mapElement = await page.locator('Map'); // แทนที่ด้วย selector ของแผนที่

  // ซูมเข้าด้วยการเลื่อน
  // await mapElement.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, -500); // เลื่อนขึ้นเพื่อซูมเข้า

  // ตรวจสอบการซูม
  // await expect(mapElement).toBeVisible(); // เปลี่ยนเป็นการตรวจสอบที่เหมาะสม
});
