"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScreenshots = void 0;
const playwright_chromium_1 = require("playwright-chromium");
const generateScreenshots = ({ inputFiles, pathOutput = 'diagrams', viewport = { width: 1280, height: 720 }, }) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield playwright_chromium_1.webkit.launch();
    const context = yield browser.newContext({
        viewport,
    });
    const page = yield context.newPage();
    for (let i = 0; i < inputFiles.length; i++) {
        const { path, subPath, fileName } = inputFiles[i];
        const diagram = `${path}/index.html`;
        const outputFilePath = `${pathOutput}${subPath ? `/${subPath}` : ''}/${fileName}.png`;
        yield page.goto(`file:${diagram}`);
        yield page.screenshot({
            path: outputFilePath,
            fullPage: true,
        });
    }
    yield browser.close();
});
exports.generateScreenshots = generateScreenshots;
