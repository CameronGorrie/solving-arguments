import Sentiment from "sentiment";
import { ArticleData, CommentScores } from "../types";

const sentiment = new Sentiment();

export function averageSentiment(data: ArticleData) {
  return Object.keys(data).reduce((acc: CommentScores, site: string) => {
    acc[site] = data[site].reduce(
      (previousAverage: number, comment: string) => {
        const { comparative } = sentiment.analyze(comment);

        return comparative + previousAverage / 2;
      },
      0
    );
    return acc;
  }, {});
}
