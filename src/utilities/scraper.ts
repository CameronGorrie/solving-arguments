import { Browser, Page } from "puppeteer";

export async function scraper<T>(
  uri: string,
  cb: (page: Page, selectors: T) => Promise<string[]>,
  selectors: T,
  browser: Browser,
  hasIframe?: boolean
) {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(uri, {
      waitUntil: "networkidle0"
    });

    if (hasIframe) {
      await page.evaluate(() => {
        const commentThread = document.getElementById("conversations");

        if (commentThread != null) {
          commentThread.scrollIntoView(true);
        }
      });

      await page.waitFor(1000);

      const iframeSrc = await page.evaluate(articleUri => {
        const iframe = document.querySelector("[data-conversation-id]");

        if (iframe == null) {
          return articleUri;
        }

        return iframe.getAttribute("src");
      }, uri);

      await page.goto(iframeSrc);
    }

    const data = await cb(page, selectors);
    await page.close();
    return data;
  } catch (err) {
    throw new Error(`Scraper issue: ${err}`);
  }
}
