import { scrapeArticleUris, scrapeComments } from "./utilities";

(async () => {
  const foo = await scrapeArticleUris([
    "site:cbc.ca/news/politics/",
    "site:breitbart.com/politics"
  ]);

  const bar = await scrapeComments(
    "https://www.cbc.ca/news/politics/grenier-us-midterms-1.4889682"
  );

  console.log(foo, bar);
})();
