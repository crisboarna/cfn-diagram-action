import { statSync } from 'fs';
import { basename, join, parse } from 'path';
import { glob, Glob } from 'glob';
import { getWorkspacePath } from './inputs';

/**
 * Output container for each file contained in target folder
 */
export type IFileMetadata = {
  /**
   * Path to file
   */
  readonly path: string;
  /**
   * Sub path to file from root path
   */
  readonly subPath: string;
  /**
   * Name of file without extension
   */
  readonly fileNameShort: string;
};

/**
 * Given a path returns array of objects with each of the files contained in all subdirectories in the path provided.
 * @param path
 */
export const getFilesMetadata = (path: string): IFileMetadata[] => {
  if (glob.hasMagic(path)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const g = new Glob(path, { noprocess: true });
    const inputPathSegments = g.minimatch.set[0].filter(
      (segment) => typeof segment === 'string' && segment !== ''
    );
    const inputPathFragment = getWorkspacePath(join(...inputPathSegments));
    const paths = glob
      .sync(path)
      .map((foundPath) => getWorkspacePath(foundPath));
    return generateFileMetadata(inputPathFragment, paths);
  }

  const stats = statSync(path);

  if (stats.isFile()) {
    const fileName = basename(path);
    return [
      {
        path,
        fileNameShort: parse(fileName).name,
        subPath: '',
      },
    ];
  }
  console.warn(`[cfn-diagram-action]: No files found for path ${path}`);
  return [];
};

const generateFileMetadata = (rootPath: string, paths: string[]) =>
  paths.map((entryPath) => {
    const fileName = basename(entryPath);
    return {
      path: entryPath,
      subPath: entryPath.replace(rootPath, '').replace(`/${fileName}`, ''),
      fileNameShort: parse(fileName).name,
    };
  });
