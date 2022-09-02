import { exec } from '@actions/exec';
import { IFileMetadata } from './files';
import { getWorkspacePath } from './inputs';
import { join } from 'path';

type ICfnDiaProp = {
  readonly key: string;
  readonly value: string;
};

export type IDiagramMetadata = {
  /**
   * Path to file from root path
   */
  readonly path: string;

  /**
   * Sub path to file from in user input
   */
  readonly subPath: string;

  /**
   * Name of file without path
   */
  readonly fileName: string;
};

export type IDiagramProps = {
  /**
   * Input Cloudformation files found on user provided input path
   */
  readonly files: IFileMetadata[];

  /**
   * Type of export to be done by cfn-diagram
   */
  readonly diagramType?: string;

  /**
   * Cloudformation types to be excluded from cfn-diagram output
   */
  readonly diagramExcludeTypes?: string;

  /**
   * Cloudformation stacks to be included in export, defaults to all
   */
  readonly diagramStacks?: string;

  /**
   * If draw.io generation, this is final output, so placing it there directly
   */
  readonly pathOutput?: string;
};

export const isGeneratingDiagramHtml = (diagramType = 'html') =>
  diagramType === 'html' || diagramType === 'h';

export const generateDiagrams = async ({
  files,
  diagramType = 'html',
  diagramExcludeTypes,
  diagramStacks,
  pathOutput = getWorkspacePath('diagrams'),
}: IDiagramProps): Promise<IDiagramMetadata[]> => {
  return Promise.all(
    files
      .map(({ path, subPath, fileNameShort }) => async () => {
        let outputPathComputed;
        let dirPath;
        if (!isGeneratingDiagramHtml(diagramType)) {
          dirPath = join(pathOutput, subPath);
          outputPathComputed = join(dirPath, `${fileNameShort}.drawio`);
        } else {
          dirPath = join(pathOutput, subPath, `${fileNameShort.toLowerCase()}`);
          outputPathComputed = dirPath;
        }

        await exec(`mkdir -p ${dirPath}`);

        const params: ICfnDiaProp[] = [
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

        const commands = params.map(
          (cur) => `${cur.key ? `-${cur.key}` : cur.key} ${cur.value} `
        );

        commands.unshift(diagramType);

        process.argv = commands;

        console.log(process.argv);

        require('@mhlabs/cfn-diagram/index');

        return {
          path: outputPathComputed,
          subPath,
          fileName: fileNameShort,
        };
      })
      .map((fn) => fn())
  );
};
