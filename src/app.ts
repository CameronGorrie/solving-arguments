import { scrapeArticleUris, scrapeComments } from "./utilities";

(async () => {
  const foo = await scrapeArticleUris(
    ["site:cbc.ca/news/politics/", "site:breitbart.com/politics"],
    "cite"
  );

  const bar = await scrapeComments(
    "https://www.cbc.ca/news/politics/trilingual-border-signage-mohawk-1.4899653",
    {
      commentTotal: ".vf-counter",
      handle: ".vf-comment-html",
      loadMore: ".vf-load-more",
      loadReplies: ".vf-replies-button"
    }
  );

  console.log(foo, bar);
})();
