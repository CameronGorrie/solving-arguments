import { Page } from "puppeteer";

export async function extractText(
  page: Page,
  selector: string
): Promise<string[]> {
  return page.evaluate(el => {
    const text: string[] = [];
    const textHandles: NodeListOf<HTMLElement> = document.querySelectorAll(el);
    textHandles.forEach(item => text.push(item.innerText));
    return text;
  }, selector);
}
