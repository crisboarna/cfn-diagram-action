describe('browser', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let generateScreenshots: any;
  const MOCK_PATH_1 = '/MOCK_PATH_1';
  const MOCK_PATH_2 = '/MOCK_PATH_2';
  const MOCK_PATH_SUB_1 = 'MOCK_PATH_SUB_1';
  const MOCK_FILENAME_1 = 'MOCK_FILENAME_1';
  const MOCK_FILENAME_2 = 'MOCK_FILENAME_2';
  const launchMock = jest.fn();
  const closeMock = jest.fn();
  const newContextMock = jest.fn();
  const newPageMock = jest.fn();
  const gotoMock = jest.fn();
  const screenshotMock = jest.fn();

  beforeEach(() => {
    launchMock.mockResolvedValue({
      newContext: newContextMock,
      close: closeMock,
    });
    newContextMock.mockResolvedValue({ newPage: newPageMock });
    newPageMock.mockResolvedValue({
      goto: gotoMock,
      screenshot: screenshotMock,
    });
    jest.mock('playwright-chromium', () => ({
      webkit: { launch: launchMock },
    }));
    generateScreenshots =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../../src/app/services/browser').generateScreenshots;
  });

  afterEach(() => jest.resetAllMocks());

  it('given array of empty input files, does nothing', async () => {
    //when
    await generateScreenshots({ inputFiles: [], pathWorkspace: '' });

    //then
    expect(launchMock).toBeCalledTimes(1);
    expect(newContextMock).toBeCalledTimes(1);
    expect(newPageMock).toBeCalledTimes(1);
    expect(gotoMock).toBeCalledTimes(0);
    expect(screenshotMock).toBeCalledTimes(0);
    expect(closeMock).toBeCalledTimes(1);
  });

  it('given array of one input files, generates one screenshot', async () => {
    //when
    await generateScreenshots({
      inputFiles: [
        {
          path: MOCK_PATH_1,
          subPath: MOCK_PATH_SUB_1,
          fileName: MOCK_FILENAME_1,
        },
      ],
    });

    //then
    expect(launchMock).toBeCalledTimes(1);
    expect(newContextMock).toBeCalledTimes(1);
    expect(newPageMock).toBeCalledTimes(1);
    expect(gotoMock).toBeCalledTimes(1);
    expect(screenshotMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledTimes(1);
    expect(gotoMock).toHaveBeenCalledWith(`file:${MOCK_PATH_1}/index.html`);
    expect(screenshotMock).toHaveBeenCalledWith({
      fullPage: true,
      path: `diagrams/${MOCK_PATH_SUB_1}/${MOCK_FILENAME_1}.png`,
    });
  });

  it('given array of multiple input files, generates one screenshot', async () => {
    //when
    await generateScreenshots({
      inputFiles: [
        {
          path: MOCK_PATH_1,
          fileName: MOCK_FILENAME_1,
        },
        {
          path: MOCK_PATH_2,
          fileName: MOCK_FILENAME_2,
        },
      ],
    });

    //then
    expect(launchMock).toBeCalledTimes(1);
    expect(newContextMock).toBeCalledTimes(1);
    expect(newPageMock).toBeCalledTimes(1);
    expect(gotoMock).toBeCalledTimes(2);
    expect(screenshotMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledTimes(1);
    expect(gotoMock).toHaveBeenCalledWith(`file:${MOCK_PATH_1}/index.html`);
    expect(screenshotMock).toHaveBeenCalledWith({
      fullPage: true,
      path: `diagrams/${MOCK_FILENAME_1}.png`,
    });
  });
});
