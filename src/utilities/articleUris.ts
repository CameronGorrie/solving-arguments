import { launch } from "puppeteer";

async function init<T>(uri: string, cb: () => T) {
  const browser = await launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(uri);
  const data = await page.evaluate(cb);
  await browser.close();
  return data;
}

function extractText() {
  const text: string[] = [];
  const textHandles: NodeListOf<HTMLElement> = document.querySelectorAll(
    "cite"
  );
  textHandles.forEach(item => text.push(item.innerText));
  return text;
}

export async function scrapeArticleUris(queries: string[], limit: number = 10) {
  return queries.reduce(async (prevPromise: any, query: string) => {
    const acc = await prevPromise;
    acc[query] = await init(
      `https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit}`,
      extractText
    );
    return acc;
  }, Promise.resolve({}));
}
