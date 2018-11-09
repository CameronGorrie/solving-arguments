import { Page } from "puppeteer";
import { extractText, scraper, Selectors } from "../utilities";

function getCommentTotal(page: Page, selector: string) {
  return page.evaluate(el => {
    const total: HTMLElement | null = document.querySelector(el);

    if (total == null) {
      throw new Error(
        "Could not find a total comment count. Are you sure you passed the correct selector?"
      );
    } else {
      return parseInt(total.innerText, 10);
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

async function getComments(
  page: Page,
  { handle, commentTotal, loadMore, loadReplies }: Selectors
) {
  const total = await getCommentTotal(page, commentTotal);

  try {
    async function crawl(currentCommentsTotal: number = 0): Promise<string[]> {
      if (currentCommentsTotal >= total) {
        return extractText(page, handle);
      } else {
        await loadMoreComments(page, loadMore, loadReplies);
        const commentsLength = await getVisibleCommentTotal(page, handle);
        return crawl(commentsLength);
      }
    }

    return await crawl();
  } catch (err) {
    throw new Error(`Encountered problem fetching comments: ${err}`);
  }
}

export async function scrapeComments(articleUri: string, selectors: Selectors) {
  return scraper(articleUri, getComments, selectors);
}
