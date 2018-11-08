import { extractText, scraper } from "../utilities";

export async function scrapeArticleUris(queries: string[], limit: number = 10) {
  return queries.reduce(async (prevPromise: any, query: string) => {
    const acc = await prevPromise;
    acc[query] = await scraper(
      `https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit}`,
      extractText,
      "cite"
    );
    return acc;
  }, Promise.resolve({}));
}
