import { launch, Page } from "puppeteer";

export async function scraper<T>(
  uri: string,
  cb: (page: Page, selector: string) => Promise<T>,
  selector: string
) {
  const browser = await launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(uri);
  const data = await cb(page, selector);
  await browser.close();
  return data;
}
