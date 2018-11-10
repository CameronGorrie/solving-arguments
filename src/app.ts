import { ArticleData, scrapeComments } from "./utilities";

async function get(data: ArticleData) {
  return Object.keys(data).reduce(
    async (prevPromise: Promise<ArticleData>, site) => {
      const acc = await prevPromise;
      acc[site] = await scrapeComments(data[site], {
        commentTotal: ".vf-counter",
        handle: ".vf-comment-html",
        loadMore: ".vf-load-more",
        loadReplies: ".vf-replies-button"
      });
      return acc;
    },
    Promise.resolve({})
  );
}

(async () => {
  // const foo = await scrapeArticleUris(["site:cbc.ca/news/politics/"], "cite");
  const foo = {
    "site:cbc.ca/news/politics/": [
      "https://www.cbc.ca/news/politics/trudeau-saturday-vimy-1.4900636",
      "https://www.cbc.ca/news/politics/lgbtq-tanzania-canadian-aid-1.4900048"
    ]
  };
  const baz = await get(foo);
  console.log(baz);
})();
