describe('main', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let run: any;
  const TEST_DIAGRAM_TYPE = 'html';
  const TEST_DIAGRAM_EXCLUDE_TYPE = 'TEST_DIAGRAM_EXCLUDE_TYPE';
  const TEST_DIAGRAM_STACKS = 'TEST_DIAGRAM_STACKS';
  const TEST_PATH_INPUT = 'TEST_PATH_INPUT';
  const TEST_PATH_OUTPUT = 'TEST_PATH_OUTPUT';
  const TEST_VIEWPORT = 'TEST_VIEWPORT';
  const TEST_FILES = 'TEST_FILES';
  const TEST_DIAGRAMS_METADATA = 'TEST_DIAGRAMS_METADATA';
  const TEST_INPUT = {
    diagramType: TEST_DIAGRAM_TYPE,
    diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE,
    diagramStacks: TEST_DIAGRAM_STACKS,
    pathInput: TEST_PATH_INPUT,
    pathOutput: TEST_PATH_OUTPUT,
    viewport: TEST_VIEWPORT,
  };
  const setFailedMock = jest.fn();
  const execMock = jest.fn();
  const generateScreenshotsMock = jest.fn();
  const getActionInputsMock = jest.fn();
  const generateDiagramsMock = jest.fn();
  const getFilesMetadataMock = jest.fn();

  beforeEach(() => {
    jest.mock('@actions/core', () => ({ setFailed: setFailedMock }));
    jest.mock('@actions/exec', () => ({ exec: execMock }));
    jest.mock('../../src/app/services/browser', () => ({
      generateScreenshots: generateScreenshotsMock,
    }));
    jest.mock('../../src/app/services/inputs', () => ({
      getActionInputs: getActionInputsMock,
    }));
    jest.mock('../../src/app/services/diagrams', () => ({
      ...jest.requireActual('../../src/app/services/diagrams'),
      generateDiagrams: generateDiagramsMock,
    }));
    jest.mock('../../src/app/services/files', () => ({
      getFilesMetadata: getFilesMetadataMock,
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    run = require('../../src/app/main').run;
  });

  afterEach(() => jest.resetAllMocks());

  describe('errors', () => {
    it('given error, sets failed', async () => {
      //given
      getActionInputsMock.mockImplementation(() => {
        throw new Error('exec error');
      });

      //when
      await run();

      //then
      expect(setFailedMock).toHaveBeenCalledWith('exec error');
    });

    it('given unknown throw, sets failed', async () => {
      //given
      getActionInputsMock.mockImplementation(() => {
        throw 'exec error';
      });

      //when
      await run();

      //then
      expect(setFailedMock).toHaveBeenCalledWith(
        'Unknown error caused failure.'
      );
    });
  });

  describe('executions', () => {
    it('generates html given no diagramType', async () => {
      //given
      const input = { ...TEST_INPUT };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete input.diagramType;
      getActionInputsMock.mockReturnValueOnce(input);
      getFilesMetadataMock.mockReturnValueOnce(TEST_FILES);
      generateDiagramsMock.mockReturnValueOnce(TEST_DIAGRAMS_METADATA);

      //when
      await run();

      //then

      expect(execMock).toHaveBeenCalledTimes(0);
      expect(getActionInputsMock).toHaveBeenCalledTimes(1);
      expect(getFilesMetadataMock).toHaveBeenCalledWith(TEST_PATH_INPUT);
      expect(generateDiagramsMock).toHaveBeenCalledWith({
        files: TEST_FILES,
        diagramType: undefined,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE,
        diagramStacks: TEST_DIAGRAM_STACKS,
        pathOutput: TEST_PATH_OUTPUT,
      });
      expect(generateScreenshotsMock).toHaveBeenCalledWith({
        inputFiles: TEST_DIAGRAMS_METADATA,
        pathOutput: TEST_PATH_OUTPUT,
        viewport: TEST_VIEWPORT,
      });
    });

    it('generates html given html diagramType', async () => {
      //given
      getActionInputsMock.mockReturnValueOnce(TEST_INPUT);
      getFilesMetadataMock.mockReturnValueOnce(TEST_FILES);
      generateDiagramsMock.mockReturnValueOnce(TEST_DIAGRAMS_METADATA);

      //when
      await run();

      //then

      expect(execMock).toHaveBeenCalledWith('npx', [
        'playwright-chromium',
        'install',
        '--with-deps',
      ]);
      expect(getActionInputsMock).toHaveBeenCalledTimes(1);
      expect(getFilesMetadataMock).toHaveBeenCalledWith(TEST_PATH_INPUT);
      expect(generateDiagramsMock).toHaveBeenCalledWith({
        files: TEST_FILES,
        diagramType: TEST_DIAGRAM_TYPE,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE,
        diagramStacks: TEST_DIAGRAM_STACKS,
        pathOutput: TEST_PATH_OUTPUT,
      });
      expect(generateScreenshotsMock).toHaveBeenCalledWith({
        inputFiles: TEST_DIAGRAMS_METADATA,
        pathOutput: TEST_PATH_OUTPUT,
        viewport: TEST_VIEWPORT,
      });
    });

    it('does not generate html given non html diagramType', async () => {
      //given
      getActionInputsMock.mockReturnValueOnce({
        ...TEST_INPUT,
        diagramType: 'draw.io',
      });
      getFilesMetadataMock.mockReturnValueOnce(TEST_FILES);
      generateDiagramsMock.mockReturnValueOnce(TEST_DIAGRAMS_METADATA);

      //when
      await run();

      //then

      expect(execMock).toHaveBeenCalledTimes(0);
      expect(getActionInputsMock).toHaveBeenCalledTimes(1);
      expect(getFilesMetadataMock).toHaveBeenCalledWith(TEST_PATH_INPUT);
      expect(generateDiagramsMock).toHaveBeenCalledWith({
        files: TEST_FILES,
        diagramType: 'draw.io',
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE,
        diagramStacks: TEST_DIAGRAM_STACKS,
        pathOutput: TEST_PATH_OUTPUT,
      });
      expect(generateScreenshotsMock).toHaveBeenCalledTimes(0);
    });
  });
});
