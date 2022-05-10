import { getInput } from '@actions/core';
import { join } from 'path';

type IActionInputs = {
  /**
   * Path where the Cloudformation templates can be found
   */
  readonly pathInput: string;

  /**
   * Path where the output diagrams should be placed
   */
  readonly pathOutput?: string;

  /**
   * What type of diagram export should be done
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
   * Browser viewport configuration
   */
  readonly viewport?: {
    readonly width: number;
    readonly height: number;
  };
};

export const getActionInputs = (): IActionInputs => {
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
    pathInput: pathInput!,
  };
};

function getStringInput(
  inputName: string,
  required?: boolean
): string | undefined {
  const input = getInput(inputName, { required });
  if (required && !input) {
    throw new Error(`Input '${inputName}' empty.`);
  }
  return input !== '' ? input : undefined;
}

function getNumberInput(
  inputName: string,
  required: boolean
): number | undefined {
  const input = getInput(inputName, { required });
  if (isFinite(parseFloat(input))) {
    return parseFloat(input);
  }
  if (!required && input === '') {
    return undefined;
  }
  throw new Error(`Input '${inputName}' is an invalid number.`);
}

function getPathInput(inputName: string): string | undefined {
  const input = getInput(inputName, { required: false });
  return input ? getWorkspacePath(input) : undefined;
}

/**
 * Returns full path including runner workspace to target path
 * @param relativePath
 */
export function getWorkspacePath(relativePath: string): string {
  const workspaceDir = process.env[`GITHUB_WORKSPACE`];
  if (workspaceDir === undefined) {
    throw new Error(
      "'GITHUB_WORKSPACE' variable is not set. Was checkout action done?"
    );
  }
  return join(workspaceDir, relativePath);
}
