"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacePath = exports.getActionInputs = void 0;
const core_1 = require("@actions/core");
const path_1 = require("path");
const getActionInputs = () => {
    const pathInput = getStringInput('path_input', true);
    const pathOutput = getPathInput('path_output');
    const diagramType = getStringInput('diagram_type');
    const diagramExcludeTypes = getStringInput('diagram_exclude_types');
    const diagramStacks = getStringInput('diagram_stacks');
    const viewPortHeight = getNumberInput('viewport_height', false);
    const viewPortWidth = getNumberInput('viewport_width', false);
    let viewport;
    if (viewPortWidth && viewPortHeight) {
        viewport = {
            width: viewPortWidth,
            height: viewPortHeight,
        };
    }
    return {
        viewport,
        diagramType,
        diagramExcludeTypes,
        diagramStacks,
        pathOutput,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pathInput: pathInput,
    };
};
exports.getActionInputs = getActionInputs;
function getStringInput(inputName, required) {
    const input = (0, core_1.getInput)(inputName, { required });
    if (required && !input) {
        throw new Error(`Input '${inputName}' empty.`);
    }
    return input !== '' ? input : undefined;
}
function getNumberInput(inputName, required) {
    const input = (0, core_1.getInput)(inputName, { required });
    if (isFinite(parseFloat(input))) {
        return parseFloat(input);
    }
    if (!required && input === '') {
        return undefined;
    }
    throw new Error(`Input '${inputName}' is an invalid number.`);
}
function getPathInput(inputName) {
    const input = (0, core_1.getInput)(inputName, { required: false });
    return input ? getWorkspacePath(input) : undefined;
}
/**
 * Returns full path including runner workspace to target path
 * @param relativePath
 */
function getWorkspacePath(relativePath) {
    const workspaceDir = process.env[`GITHUB_WORKSPACE`];
    if (workspaceDir === undefined) {
        throw new Error("'GITHUB_WORKSPACE' variable is not set. Was checkout action done?");
    }
    return (0, path_1.join)(workspaceDir, relativePath);
}
exports.getWorkspacePath = getWorkspacePath;
