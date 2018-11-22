import { Browser, Page } from "puppeteer";

// async function scrapeIframe(page: Page) {
//   await page.evaluate(async () => {
//     const bar = document.getElementById("conversations");

//     if (bar != null) {
//       bar.scrollIntoView(true);
//     }
//   });

//   await page.waitFor(10000);

//   const biz = await page.evaluate(() => {
//     const iframe = document.querySelector("[data-conversation-id]");

//     if (iframe == null) {
//       return;
//     }

//     return iframe.getAttribute("src");
//   });

//   return biz;
// }

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
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // if the iframe selector exists in the config
    // set the `uri` to the iframe
    // const yeezy = await scrapeIframe(page);
    // console.log(`throwaway: ${uri} ++++ ${yeezy}`);

    try {
      await page.goto(uri, { timeout: 2000000 });
    } catch (err) {
      await page.close();
      throw new Error(`fuck: ${err}`);
    }

    if (hasIframe) {
      await page.evaluate(() => {
        const foo = document.getElementById("conversations");

        if (foo != null) {
          foo.scrollIntoView(true);
        }
      });

      await page.waitFor(60000);

      const yar = await page.evaluate(() => {
        const iframe = document.querySelector("[data-conversation-id]");

        if (iframe == null) {
          return uri;
        }

        return iframe.getAttribute("src");
      });

      await page.goto(yar);
    }

    const data = await cb(page, selectors);
    await page.close();
    return data;
  } catch (err) {
    throw new Error(`Scraper issue: ${err}`);
  }
}
