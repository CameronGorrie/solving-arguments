import { launch } from "puppeteer";

async function goTo<T>(uri: string, cb: () => T) {
  const browser = await launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(uri);
  await page.waitFor(1000);
  const foo = await page.evaluate(cb);
  await browser.close();
  return foo;
}

function extractText() {
  const text: string[] = [];
  const textHandles: NodeListOf<HTMLElement> = document.querySelectorAll(
    "cite"
  );
  textHandles.forEach(item => text.push(item.innerText));
  return text;
}

function googleSearch(query: string, limit: number = 10) {
  return goTo(
    `https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit}`,
    extractText
  );
}

(async () => {
  const bar = await googleSearch("site:cbc.ca/news/politics/");
  console.log(bar);
})();
