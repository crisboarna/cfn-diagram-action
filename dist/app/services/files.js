"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesMetadata = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const glob_1 = require("glob");
const inputs_1 = require("./inputs");
/**
 * Given a path returns array of objects with each of the files contained in all subdirectories in the path provided.
 * @param path
 */
const getFilesMetadata = (path) => {
    if (glob_1.glob.hasMagic(path)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const g = new glob_1.Glob(path, { noprocess: true });
        const inputPathSegments = g.minimatch.set[0].filter((segment) => typeof segment === 'string' && segment !== '');
        const inputPathFragment = (0, inputs_1.getWorkspacePath)((0, path_1.join)(...inputPathSegments));
        const paths = glob_1.glob
            .sync(path)
            .map((foundPath) => (0, inputs_1.getWorkspacePath)(foundPath));
        return generateFileMetadata(inputPathFragment, paths);
    }
    const stats = (0, fs_1.statSync)(path);
    if (stats.isFile()) {
        const fileName = (0, path_1.basename)(path);
        return [
            {
                path,
                fileNameShort: (0, path_1.parse)(fileName).name,
                subPath: '',
            },
        ];
    }
    console.warn(`[cfn-diagram-action]: No files found for path ${path}`);
    return [];
};
exports.getFilesMetadata = getFilesMetadata;
const generateFileMetadata = (rootPath, paths) => paths.map((entryPath) => {
    const fileName = (0, path_1.basename)(entryPath);
    return {
        path: entryPath,
        subPath: entryPath.replace(rootPath, '').replace(`/${fileName}`, ''),
        fileNameShort: (0, path_1.parse)(fileName).name,
    };
});
