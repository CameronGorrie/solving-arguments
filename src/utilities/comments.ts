import { Page } from "puppeteer";
import { extractText, scraper } from "../utilities";

interface CommentMetaData {
  nodes: NodeListOf<Element>;
  length: number;
}

function getCommentMetaData(
  page: Page,
  selector: string
): Promise<CommentMetaData> {
  return page.evaluate(el => {
    const nodes = document.querySelectorAll(el);
    return {
      length: nodes.length,
      nodes
    };
  }, selector);
}

function loadMoreComments() {
  const loadMoreButton: HTMLElement | null = document.querySelector(
    ".vf-load-more"
  );

  if (loadMoreButton != null) {
    loadMoreButton.click();
  }
}

async function getComments(page: Page, selector: string) {
  try {
    async function crawl(
      commentLength: number = 0,
      counter: number = 0
    ): Promise<string[]> {
      if (commentLength >= 100 || counter > 100) {
        return extractText(page, selector);
      } else {
        const { length } = await getCommentMetaData(page, selector);
        await page.evaluate(loadMoreComments);
        return crawl(length, counter++);
      }
    }

    return await crawl();
  } catch (err) {
    throw new Error(`Encountered problem fetching comments: ${err}`);
  }
}

export async function scrapeComments(articleUri: string, selector: string) {
  return scraper(articleUri, getComments, selector);
}
