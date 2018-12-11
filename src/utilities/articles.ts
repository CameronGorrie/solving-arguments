import { Browser } from "puppeteer";
import { ArticleData } from "../types";
import { extractText, scraper } from "../utilities";

export async function scrapeArticleUris(
  queries: string[],
  selector: string,
  browser: Browser,
  limit: number = 5
): Promise<ArticleData> {
  return queries.reduce(
    async (prevPromise: Promise<ArticleData>, query: string) => {
      const acc = await prevPromise;
      acc[query] = await scraper(
        `https://www.google.com/search?q=${query}&num=${limit}&start=10`,
        extractText,
        selector,
        browser
      );
      return acc;
    },
    Promise.resolve({})
  );
}
