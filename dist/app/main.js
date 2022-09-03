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
exports.run = void 0;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const browser_1 = require("./services/browser");
const inputs_1 = require("./services/inputs");
const diagrams_1 = require("./services/diagrams");
const files_1 = require("./services/files");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // retrieves all inputs from user
            const { diagramType, diagramExcludeTypes, diagramStacks, pathInput, pathOutput, viewport, } = (0, inputs_1.getActionInputs)();
            // if (diagramType && isGeneratingDiagramHtml(diagramType)) {
            // configures playwright in the environment
            // await setup();
            // }
            // retrieves all files contained within the path if directory, or of single file if path includes file
            const files = (0, files_1.getFilesMetadata)(pathInput);
            // generates the diagrams for all the provided templates in temporary directory
            const diagramsMetadata = yield (0, diagrams_1.generateDiagrams)({
                files,
                diagramType,
                diagramExcludeTypes,
                diagramStacks,
                pathOutput,
            });
            if ((0, diagrams_1.isGeneratingDiagramHtml)(diagramType)) {
                // generates screenshots from diagram vis.js export data
                yield (0, browser_1.generateScreenshots)({
                    inputFiles: diagramsMetadata,
                    pathOutput,
                    viewport,
                });
            }
        }
        catch (e) {
            if (e instanceof Error) {
                (0, core_1.setFailed)(e.message);
            }
            else {
                (0, core_1.setFailed)('Unknown error caused failure.');
            }
        }
    });
}
exports.run = run;
const setup = () => __awaiter(void 0, void 0, void 0, function* () { return (0, exec_1.exec)('npx', ['playwright-chromium', 'install', '--with-deps']); });
