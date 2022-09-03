describe('diagrams', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let generateDiagrams: any;
  const TARGET_HTML_1 = 'html';
  const TARGET_HTML_2 = 'h';
  const TARGET_DRAWIO_1 = 'draw.io';
  const TARGET_DRAWIO_2 = 'd';
  const TEST_PATH_1 = 'TEST_PATH_1';
  const TEST_PATH_2 = 'TEST_PATH_2';
  const TEST_PATH_SUB_1 = '/TEST_PATH_SUB_1';
  const TEST_PATH_SUB_2 = '/TEST_PATH_SUB_2';
  const TEST_FILE_1 = 'TEST_FILE_1';
  const TEST_FILE_2 = 'TEST_FILE_2';
  const TEST_DIAGRAM_EXCLUDE_TYPE_1 = 'TEST_DIAGRAM_EXCLUDE_TYPE_1';
  const TEST_DIAGRAM_EXCLUDE_TYPE_2 = 'TEST_DIAGRAM_EXCLUDE_TYPE_2';
  const TEST_DIAGRAM_STACKS_1 = 'TEST_DIAGRAM_STACKS_1';
  const TEST_DIAGRAM_STACKS_2 = 'TEST_DIAGRAM_STACKS_2';
  const TEST_PATH_OUTPUT_1 = 'TEST_PATH_OUTPUT_1';
  const GITHUB_WORKSPACE = 'GITHUB_WORKSPACE';
  const DEFAULT_PATH_DIAGRAM = 'DEFAULT_PATH_DIAGRAM';

  const FILE_1 = {
    path: TEST_PATH_1,
    subPath: TEST_PATH_SUB_1,
    fileNameShort: TEST_FILE_1,
  };
  const FILE_2 = {
    path: TEST_PATH_2,
    subPath: TEST_PATH_SUB_2,
    fileNameShort: TEST_FILE_2,
  };
  const execMock = jest.fn();
  const workspaceMock = jest.fn();
  process.env.GITHUB_WORKSPACE = GITHUB_WORKSPACE;

  beforeEach(() => {
    //given
    jest.mock('@actions/exec', () => ({ exec: execMock }));
    jest.mock('../../../src/app/services/inputs', () => ({
      getWorkspacePath: workspaceMock,
    }));
    execMock.mockReturnValue('');
    workspaceMock.mockReturnValue(DEFAULT_PATH_DIAGRAM);
    generateDiagrams =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../../src/app/services/diagrams').generateDiagrams;
  });

  afterEach(() => jest.resetAllMocks());

  describe('generate html', () => {
    it('only files params', async () => {
      //when
      const res = await generateDiagrams({ files: [FILE_1] });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -c`
      );
    });

    it('files params and diagramType html', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_HTML_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -c`
      );
    });

    it('files params and diagramType h', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_HTML_2,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_2} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -c`
      );
    });

    it('files params, diagramType html, diagramExcludeTypes', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_HTML_1,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1} -c`
      );
    });

    it('files params, diagramType html, diagramExcludeTypes, diagramStacks', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_HTML_1,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE_1,
        diagramStacks: TEST_DIAGRAM_STACKS_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1} --stacks ${TEST_DIAGRAM_STACKS_1} -c`
      );
    });

    it('files params, diagramType html, diagramExcludeTypes, diagramStacks, pathOutput', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_HTML_1,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE_1,
        diagramStacks: TEST_DIAGRAM_STACKS_1,
        pathOutput: TEST_PATH_OUTPUT_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1} --stacks ${TEST_DIAGRAM_STACKS_1} -c`
      );
    });

    it('files params, diagramType d, diagramExcludeTypes, diagramStacks, pathOutput', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1],
        diagramType: TARGET_DRAWIO_1,
        diagramExcludeTypes: TEST_DIAGRAM_EXCLUDE_TYPE_1,
        diagramStacks: TEST_DIAGRAM_STACKS_1,
        pathOutput: TEST_PATH_OUTPUT_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_DRAWIO_1} -t ${TEST_PATH_1} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1} --stacks ${TEST_DIAGRAM_STACKS_1} -c`
      );
    });

    it('files params, diagramType drawio, diagramExcludeTypes, diagramStacks, pathOutput', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1, FILE_2],
        diagramType: TARGET_DRAWIO_2,
        diagramExcludeTypes: `${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2}`,
        diagramStacks: `${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2}`,
        pathOutput: TEST_PATH_OUTPUT_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}/${TEST_FILE_2}.drawio`,
          subPath: TEST_PATH_SUB_2,
          fileName: TEST_FILE_2,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_DRAWIO_2} -t ${TEST_PATH_1} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_DRAWIO_2} -t ${TEST_PATH_2} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}/${TEST_FILE_2}.drawio -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
    });

    it('2 files params, diagramType html, diagramExcludeTypes, diagramStacks, pathOutput', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1, FILE_2],
        diagramType: TARGET_HTML_1,
        diagramExcludeTypes: `${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2}`,
        diagramStacks: `${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2}`,
        pathOutput: TEST_PATH_OUTPUT_1,
      });

      //then
      expect(res).toEqual([
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
        {
          path: `${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()}`,
          subPath: TEST_PATH_SUB_2,
          fileName: TEST_FILE_2,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_2} -o ${TEST_PATH_OUTPUT_1}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
    });

    it('2 files params, diagramType html, diagramExcludeTypes, diagramStacks', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1, FILE_2],
        diagramType: TARGET_HTML_1,
        diagramExcludeTypes: `${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2}`,
        diagramStacks: `${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2}`,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()}`,
          subPath: TEST_PATH_SUB_2,
          fileName: TEST_FILE_2,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_HTML_1} -t ${TEST_PATH_2} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}/${TEST_FILE_2.toLowerCase()} -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
    });

    it('2 files params, diagramType d, diagramExcludeTypes, diagramStacks', async () => {
      //when
      const res = await generateDiagrams({
        files: [FILE_1, FILE_2],
        diagramType: TARGET_DRAWIO_2,
        diagramExcludeTypes: `${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2}`,
        diagramStacks: `${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2}`,
      });

      //then
      expect(res).toEqual([
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio`,
          subPath: TEST_PATH_SUB_1,
          fileName: TEST_FILE_1,
        },
        {
          path: `${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}/${TEST_FILE_2}.drawio`,
          subPath: TEST_PATH_SUB_2,
          fileName: TEST_FILE_2,
        },
      ]);
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `mkdir -p ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_DRAWIO_2} -t ${TEST_PATH_1} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_1}/${TEST_FILE_1}.drawio -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
      expect(execMock).toHaveBeenCalledWith(
        `cfn-dia ${TARGET_DRAWIO_2} -t ${TEST_PATH_2} -o ${DEFAULT_PATH_DIAGRAM}${TEST_PATH_SUB_2}/${TEST_FILE_2}.drawio -e ${TEST_DIAGRAM_EXCLUDE_TYPE_1},${TEST_DIAGRAM_EXCLUDE_TYPE_2} --stacks ${TEST_DIAGRAM_STACKS_1},${TEST_DIAGRAM_STACKS_2} -c`
      );
    });
  });
});
