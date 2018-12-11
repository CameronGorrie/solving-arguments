import { launch } from "puppeteer";
import { averageSentiment, getComments, scrapeArticleUris } from "./utilities";

(async () => {
  const browser = await launch({
    // headless: false
  });

  try {
    const articleList = await scrapeArticleUris(
      ["site:cbc.ca/news/politics/"],
      "cite",
      browser,
      100
    );
    const commentList = await getComments(articleList, browser);
    const data = averageSentiment(commentList);
    await browser.close();
    console.log(data);
  } catch (err) {
    throw new Error(err);
  }
})();
