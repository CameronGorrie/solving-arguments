import { launch, Page } from "puppeteer";

export async function scraper<T>(
  uri: string,
  cb: (page: Page, selectors: T) => Promise<any>,
  selectors: T
) {
  const browser = await launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(uri);
  const data = await cb(page, selectors);
  await browser.close();
  return data;
}
