import { Browser, Page } from "puppeteer";
import { ArticleData, Selectors } from "../types";
import { config, extractText, scraper } from "../utilities";

function getCommentTotal(page: Page, selector: string): Promise<number> {
  return page.evaluate(el => {
    const regex = /\D+/;
    const total: HTMLElement | null = document.querySelector(el);

    if (total == null) {
      return 0;
    } else {
      return parseInt(total.innerText.replace(regex, ""), 10);
    }
  }, selector);
}

function getVisibleCommentTotal(page: Page, selector: string) {
  return page.evaluate(el => {
    return document.querySelectorAll(el).length;
  }, selector);
}

async function loadMoreComments(
  page: Page,
  loadMore: string,
  loadReplies: string
) {
  await page.waitFor(1000);

  return page.evaluate(
    ([more, replies]) => {
      const loadMoreButton: HTMLElement | null = document.querySelector(more);

      if (loadMoreButton == null) {
        return;
      }

      loadMoreButton.click();

      const loadReplyButtons: any | null = document.querySelectorAll(replies);

      if (loadMoreButton == null) {
        return;
      }

      loadReplyButtons.forEach((button: any) => button.click());
    },
    [loadMore, loadReplies]
  );
}

async function scrapeComments(
  page: Page,
  { handle, commentTotal, loadMore, loadReplies }: Selectors,
  limit: number = 50
) {
  const total = await getCommentTotal(page, commentTotal);

  try {
    return (async function crawl(
      currentCommentsTotal: number = 0
    ): Promise<string[]> {
      if (currentCommentsTotal >= total || currentCommentsTotal >= limit) {
        return extractText(page, handle);
      } else {
        await loadMoreComments(page, loadMore, loadReplies);
        const commentsLength = await getVisibleCommentTotal(page, handle);
        return crawl(commentsLength);
      }
    })();
  } catch (err) {
    throw new Error(`Encountered problem fetching comments: ${err}`);
  }
}

export async function getComments(
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
        const hasIframe = Boolean(configHost.iframe);
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
          hasIframe
        );
        return acc.concat(currentArticleComments);
      },
      Promise.resolve([])
    );

    prev[site] = await aggregatedCommentsBySite;
    return prev;
  }, {});
}
