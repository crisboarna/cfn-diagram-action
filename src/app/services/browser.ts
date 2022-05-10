import { webkit } from 'playwright-chromium';
import { IDiagramMetadata } from './diagrams';

export type BrowserConfigs = {
  /**
   * Url of diagram to generate image from and name of file
   */
  readonly inputFiles: IDiagramMetadata[];

  /**
   * Final output path for all exports
   */
  readonly pathOutput?: string;

  /**
   * Viewport configuration for image generation
   */
  readonly viewport?: {
    /**
     * page width in pixels.
     */
    width: number;

    /**
     * page height in pixels.
     */
    height: number;
  };
};

export const generateScreenshots = async ({
  inputFiles,
  pathOutput = 'diagrams',
  viewport = { width: 1280, height: 720 },
}: BrowserConfigs) => {
  const browser = await webkit.launch();
  const context = await browser.newContext({
    viewport,
  });
  const page = await context.newPage();

  for (let i = 0; i < inputFiles.length; i++) {
    const { path, subPath, fileName } = inputFiles[i];

    const diagram = `${path}/index.html`;

    const outputFilePath = `${pathOutput}${
      subPath ? `/${subPath}` : ''
    }/${fileName}.png`;

    await page.goto(`file:${diagram}`);
    await page.screenshot({
      path: outputFilePath,
      fullPage: true,
    });
  }
  await browser.close();
};
