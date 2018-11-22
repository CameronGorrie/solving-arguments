export interface ArticleData {
  [key: string]: string[];
}

export interface Selectors {
  commentTotal: string;
  handle: string;
  iframe?: string;
  loadMore: string;
  loadReplies: string;
}
