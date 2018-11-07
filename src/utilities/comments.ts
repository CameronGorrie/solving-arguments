import { launch, Page } from "puppeteer";

interface CommentMetaData {
  nodes: NodeListOf<Element>;
  length: number;
}

function getCommentMetaData(): CommentMetaData {
  const nodes = document.querySelectorAll(".vf-comment-html");
  return {
    length: nodes.length,
    nodes
  };
}

function extractComments() {
  const comments: string[] = [];
  const commentHandles = document.querySelectorAll(".vf-comment-html");
  commentHandles.forEach(comment => comments.push(comment.innerHTML));
  return comments;
}

function loadMoreComments() {
  const loadMoreButton: HTMLElement | null = document.querySelector(
    ".vf-load-more"
  );

  if (loadMoreButton != null) {
    loadMoreButton.click();
  }
}

async function getComments(page: Page, delay: number = 1000) {
  try {
    await page.waitFor(delay);

    async function commentIter(
      commentLength: number = 0,
      counter: number = 0
    ): Promise<string[]> {
      if (commentLength >= 100 || counter > 100) {
        return page.evaluate(extractComments);
      } else {
        const { length } = await page.evaluate(getCommentMetaData);
        await page.evaluate(loadMoreComments);
        return commentIter(length, counter++);
      }
    }

    return await commentIter();
  } catch (err) {
    throw new Error(`Encountered problem fetching comments: ${err}`);
  }
}

export async function scrapeComments(articleUri: string) {
  const browser = await launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(articleUri);
  const comments = await getComments(page);
  await browser.close();
  return comments;
}
