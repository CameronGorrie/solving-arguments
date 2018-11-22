import { Page } from "puppeteer";
import { extractText, Selectors } from "../scraper";

async function getCommentTotal(page: Page, selector: string): Promise<number> {
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
      const loadMoreButton = document.querySelector(more);
      loadMoreButton.click();

      const loadReplyButtons = document.querySelectorAll(replies);
      loadReplyButtons.forEach(button => button.click());
    },
    [loadMore, loadReplies]
  );
}

export async function scrapeComments(
  page: Page,
  { handle, commentTotal, loadMore, loadReplies }: Selectors,
  limit: number = 2
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
