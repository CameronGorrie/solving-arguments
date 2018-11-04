"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
function getCommentMetaData() {
    const nodes = document.querySelectorAll(".vf-comment-html");
    return {
        length: nodes.length,
        nodes
    };
}
function extractComments() {
    const comments = [];
    const commentHandles = document.querySelectorAll(".vf-comment-html");
    commentHandles.forEach(comment => comments.push(comment.innerHTML));
    return comments;
}
function loadMoreComments() {
    const loadMoreButton = document.querySelector(".vf-load-more");
    if (loadMoreButton != null) {
        loadMoreButton.click();
    }
}
function getComments(page, delay = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.waitFor(delay);
            function commentIter(commentLength = 0, counter = 0) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (commentLength >= 100 || counter > 100) {
                        return page.evaluate(extractComments);
                    }
                    else {
                        const { length } = yield page.evaluate(getCommentMetaData);
                        yield page.evaluate(loadMoreComments);
                        return commentIter(length, counter++);
                    }
                });
            }
            return yield commentIter();
        }
        catch (err) {
            throw new Error(`Encountered problem fetching comments: ${err}`);
        }
    });
}
function commentScraper(articleUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.launch({
            devtools: true,
            headless: false
        });
        const page = yield browser.newPage();
        yield page.goto(articleUri);
        const comments = yield getComments(page);
        yield browser.close();
        return comments;
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    const foo = yield commentScraper("https://www.cbc.ca/news/politics/grenier-us-midterms-1.4889682");
    console.log(foo);
}))();
//# sourceMappingURL=scrapeComments.js.map