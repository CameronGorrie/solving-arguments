import { Browser, launch } from "puppeteer";

import {
  ArticleData,
  config,
  scrapeArticleUris,
  scrapeComments,
  scraper
} from "./scraper";

async function getComments(
  data: ArticleData,
  browser: Browser
): Promise<ArticleData> {
  const hostRegex = /(?<=\:)(.*?)(?=\.)/;
  return Object.keys(data).reduce(async (prev: ArticleData, site: string) => {
    const hostName = site.match(hostRegex);

    if (hostName == null) {
      return prev;
    }

    const configHost = config[hostName[0]];
    const aggregatedCommentsBySite = data[site].reduce(
      async (prevPromise: Promise<string[]>, uri: string) => {
        const acc = await prevPromise;
        const currentArticleComments = await scraper(
          uri,
          scrapeComments,
          {
            commentTotal: configHost.commentTotal,
            handle: configHost.handle,
            iframe: configHost.iframe,
            loadMore: configHost.loadMore,
            loadReplies: configHost.loadReplies
          },
          browser,
          true
        );
        return acc.concat(currentArticleComments);
      },
      Promise.resolve([])
    );

    prev[site] = await aggregatedCommentsBySite;
    return prev;
  }, {});
}

(async () => {
  const browser = await launch({
    devtools: true,
    headless: false,
    slowMo: 50
  });

  try {
    const foo = await scrapeArticleUris(
      ["site:cbc.ca/news/politics/", "site:huffingtonpost.ca/2018"],
      "cite",
      browser
    );
    console.log(foo);
    const baz = await getComments(
      {
        "site:huffingtonpost.ca/2018": [
          "https://www.huffingtonpost.ca/2018/11/30/canada-signs-new-trade-deal-with-u-s-mexico-on-sidelines-of-g20-summit_a_23605219"
        ]
      },
      browser
    );
    console.log(baz);
  } catch (err) {
    throw new Error(`${err}`);
  }

  await browser.close();
})();
