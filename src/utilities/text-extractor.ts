import { Page } from "puppeteer";

export async function extractText(
  page: Page,
  selector: string
): Promise<string[]> {
  return page.evaluate((el: string) => {
    const text: string[] = [];
    const nodes: NodeListOf<HTMLElement> = document.querySelectorAll(el);
    nodes.forEach(node => {
      const userName = /@([^\s]+\s+[^\s]+\s)/g;
      const sanitizedText = node.innerText
        .replace(userName, "")
        .replace(/\n/g, " ");
      return text.push(sanitizedText);
    });
    return text;
  }, selector);
}
