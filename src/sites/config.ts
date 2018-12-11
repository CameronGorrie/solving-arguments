import { Selectors } from "../types";

interface Sites {
  [key: string]: Selectors;
}

export const config: Sites = {
  breitbart: {
    commentTotal: ".comment-count",
    handle: ".post-message",
    loadMore: ".load-more",
    loadReplies: ".realtime-button"
  },
  cbc: {
    commentTotal: ".vf-counter",
    handle: ".vf-comment-html",
    loadMore: ".vf-load-more",
    loadReplies: ".vf-replies-button"
  },
  huffingtonpost: {
    commentTotal: ".param-messagesCount",
    handle: ".sppre_text-entity",
    iframe: ".conversations",
    loadMore: ".sppre_load-more-messages",
    loadReplies: ".sppre_show-more-replies-button"
  }
};
