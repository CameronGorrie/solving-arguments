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
function goTo(uri, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.launch({
            devtools: true,
            headless: false
        });
        const page = yield browser.newPage();
        yield page.goto(uri);
        yield page.waitFor(1000);
        const foo = yield page.evaluate(cb);
        yield browser.close();
        return foo;
    });
}
function extractText() {
    const text = [];
    const textHandles = document.querySelectorAll("cite");
    textHandles.forEach(item => text.push(item.innerText));
    return text;
}
function googleSearch(query, limit = 10) {
    return goTo(`https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit}`, extractText);
}
(() => __awaiter(this, void 0, void 0, function* () {
    const bar = yield googleSearch("site:cbc.ca/news/politics/");
    console.log(bar);
}))();
//# sourceMappingURL=scrapeArticleUris.js.map