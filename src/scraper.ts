import { launch } from "puppeteer";

(async function scrape() {
  const browser = await launch({ headless: true });
  console.log(browser);
})();
