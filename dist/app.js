'use strict';

var puppeteer = require('puppeteer');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function init(uri, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({
            devtools: true,
            headless: false
        });
        const page = yield browser.newPage();
        yield page.goto(uri);
        const data = yield page.evaluate(cb);
        yield browser.close();
        return data;
    });
}
function extractText() {
    const text = [];
    const textHandles = document.querySelectorAll("cite");
    textHandles.forEach(item => text.push(item.innerText));
    return text;
}
function scrapeArticleUris(queries, limit = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        return queries.reduce((prevPromise, query) => __awaiter(this, void 0, void 0, function* () {
            const acc = yield prevPromise;
            acc[query] = yield init(`https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit}`, extractText);
            return acc;
        }), Promise.resolve({}));
    });
}

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
function scrapeComments(articleUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({
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

(() => __awaiter(undefined, void 0, void 0, function* () {
    const foo = yield scrapeArticleUris([
        "site:cbc.ca/news/politics/",
        "site:breitbart.com/politics"
    ]);
    const bar = yield scrapeComments("https://www.cbc.ca/news/politics/grenier-us-midterms-1.4889682");
    console.log(foo, bar);
}))();
