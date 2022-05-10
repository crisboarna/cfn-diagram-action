describe('files', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getFilesMetadata: any;
  const TEST_PATH = 'TEST_PATH';
  const TEST_BASE_NAME = 'TEST_BASE_NAME';
  const TEST_FILE_NAME = 'TEST_FILE_NAME';
  const TEST_FILE_ABSOLUTE = 'TEST_FILE_ABSOLUTE';
  const statSyncMock = jest.fn();
  const basenameMock = jest.fn();
  const joinMock = jest.fn();
  const parseMock = jest.fn();
  const globHasMagicMock = jest.fn();
  const globSyncMock = jest.fn();
  const GlobMock = jest.fn();
  const workspaceMock = jest.fn();

  beforeEach(() => {
    jest.mock('fs', () => ({
      statSync: statSyncMock,
    }));
    jest.mock('path', () => ({
      basename: basenameMock,
      join: joinMock,
      parse: parseMock,
    }));
    jest.mock('glob', () => ({
      glob: { hasMagic: globHasMagicMock, sync: globSyncMock },
      Glob: GlobMock,
    }));
    jest.mock('../../../src/app/services/inputs', () => ({
      getWorkspacePath: workspaceMock,
    }));
    getFilesMetadata =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../../src/app/services/files').getFilesMetadata;
  });

  afterEach(() => jest.resetAllMocks());

  it('path is unknown', () => {
    //given
    globHasMagicMock.mockReturnValueOnce(false);
    statSyncMock.mockImplementation(() => ({
      isFile: () => false,
    }));

    //when
    const res = getFilesMetadata(TEST_PATH);

    //then
    expect(res).toEqual([]);
    expect(basenameMock).toHaveBeenCalledTimes(0);
    expect(parseMock).toHaveBeenCalledTimes(0);
  });

  it('path is file', () => {
    //given
    globHasMagicMock.mockReturnValueOnce(false);
    statSyncMock.mockImplementation(() => ({
      isFile: () => true,
    }));
    basenameMock.mockImplementation(() => TEST_BASE_NAME);
    parseMock.mockImplementation(() => ({ name: TEST_FILE_NAME }));

    //when
    const res = getFilesMetadata(TEST_PATH);

    //then
    expect(res).toEqual([
      { subPath: '', path: TEST_PATH, fileNameShort: TEST_FILE_NAME },
    ]);
  });

  it('path has glob magic but no elements found', () => {
    //given
    globHasMagicMock.mockReturnValueOnce(true);
    globSyncMock.mockReturnValueOnce([]);
    GlobMock.mockImplementation(() => ({ minimatch: { set: [[]] } }));

    //when
    const res = getFilesMetadata(TEST_PATH);

    //then
    expect(res).toEqual([]);
    expect(statSyncMock).toHaveBeenCalledTimes(0);
    expect(basenameMock).toHaveBeenCalledTimes(0);
    expect(workspaceMock).toHaveBeenCalledTimes(1);
  });

  it('path is one nested directory', () => {
    //given
    globHasMagicMock.mockReturnValueOnce(true);
    GlobMock.mockImplementation(() => ({
      minimatch: { set: [[TEST_PATH, TEST_BASE_NAME]] },
    }));
    workspaceMock.mockReturnValueOnce(`${TEST_PATH}/${TEST_BASE_NAME}`);
    workspaceMock.mockReturnValueOnce(TEST_FILE_ABSOLUTE);
    globSyncMock.mockReturnValueOnce([
      `${TEST_PATH}/${TEST_BASE_NAME}/${TEST_FILE_NAME}`,
    ]);
    basenameMock.mockImplementation(() => TEST_BASE_NAME);
    parseMock.mockImplementation(() => ({ name: TEST_FILE_NAME }));
    joinMock.mockReturnValueOnce(`${TEST_PATH}/${TEST_BASE_NAME}`);

    //when
    const res = getFilesMetadata(TEST_PATH);

    //then
    expect(res).toEqual([
      {
        subPath: TEST_FILE_ABSOLUTE,
        path: TEST_FILE_ABSOLUTE,
        fileNameShort: TEST_FILE_NAME,
      },
    ]);
    expect(statSyncMock).toHaveBeenCalledTimes(0);
    expect(basenameMock).toHaveBeenCalledWith(TEST_FILE_ABSOLUTE);
  });
});
