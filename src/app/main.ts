import { setFailed } from '@actions/core';
import { generateScreenshots } from './services/browser';
import { getActionInputs } from './services/inputs';
import { generateDiagrams, isGeneratingDiagramHtml } from './services/diagrams';
import { getFilesMetadata } from './services/files';

export async function run(): Promise<void> {
  try {
    // retrieves all inputs from user
    const {
      diagramType,
      diagramExcludeTypes,
      diagramStacks,
      pathInput,
      pathOutput,
      viewport,
    } = getActionInputs();

    // if (diagramType && isGeneratingDiagramHtml(diagramType)) {
    // configures playwright in the environment
    // await setup();
    // }

    // retrieves all files contained within the path if directory, or of single file if path includes file
    const files = getFilesMetadata(pathInput);

    // generates the diagrams for all the provided templates in temporary directory
    const diagramsMetadata = await generateDiagrams({
      files,
      diagramType,
      diagramExcludeTypes,
      diagramStacks,
      pathOutput,
    });

    if (isGeneratingDiagramHtml(diagramType)) {
      // generates screenshots from diagram vis.js export data
      await generateScreenshots({
        inputFiles: diagramsMetadata,
        pathOutput,
        viewport,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      setFailed(e.message);
    } else {
      setFailed('Unknown error caused failure.');
    }
  }
}

// const setup = async () =>
//   exec('npx', ['playwright-chromium', 'install', '--with-deps']);
