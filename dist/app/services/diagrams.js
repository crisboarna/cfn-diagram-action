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
exports.generateDiagrams = exports.isGeneratingDiagramHtml = void 0;
const exec_1 = require("@actions/exec");
const inputs_1 = require("./inputs");
const path_1 = require("path");
const isGeneratingDiagramHtml = (diagramType = 'html') => diagramType === 'html' || diagramType === 'h';
exports.isGeneratingDiagramHtml = isGeneratingDiagramHtml;
const generateDiagrams = ({ files, diagramType = 'html', diagramExcludeTypes, diagramStacks, pathOutput = (0, inputs_1.getWorkspacePath)('diagrams'), }) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(files
        .map(({ path, subPath, fileNameShort }) => () => __awaiter(void 0, void 0, void 0, function* () {
        let outputPathComputed;
        let dirPath;
        if (!(0, exports.isGeneratingDiagramHtml)(diagramType)) {
            dirPath = (0, path_1.join)(pathOutput, subPath);
            outputPathComputed = (0, path_1.join)(dirPath, `${fileNameShort}.drawio`);
        }
        else {
            dirPath = (0, path_1.join)(pathOutput, subPath, `${fileNameShort.toLowerCase()}`);
            outputPathComputed = dirPath;
        }
        yield (0, exec_1.exec)(`mkdir -p ${dirPath}`);
        const params = [
            {
                key: 't',
                value: path,
            },
            {
                key: 'o',
                value: outputPathComputed,
            },
        ];
        if (diagramExcludeTypes) {
            params.push({ key: 'e', value: diagramExcludeTypes });
        }
        if (diagramStacks) {
            params.push({ key: '-stacks', value: diagramStacks });
        }
        const commands = params.map((cur) => `${cur.key ? `-${cur.key}` : cur.key} ${cur.value} `);
        commands.unshift(diagramType);
        process.argv = commands;
        console.log(process.argv);
        require('@mhlabs/cfn-diagram/index');
        return {
            path: outputPathComputed,
            subPath,
            fileName: fileNameShort,
        };
    }))
        .map((fn) => fn()));
});
exports.generateDiagrams = generateDiagrams;
