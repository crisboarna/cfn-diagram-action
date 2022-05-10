describe('inputs', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getActionInputs: any;
  const actionsGetInput = jest.fn();
  const pathJoin = jest.fn();
  const GITHUB_WORKSPACE = 'GITHUB_WORKSPACE';
  const INPUT_PATH_MOCK = 'INPUT_PATH_MOCK';
  const OUTPUT_PATH_MOCK = 'OUTPUT_PATH_MOCK';
  const INPUT_EMPTY = {
    diagramExcludeTypes: undefined,
    diagramStacks: undefined,
    diagramType: undefined,
    pathInput: INPUT_PATH_MOCK,
    pathOutput: undefined,
    viewport: undefined,
  };

  jest.mock('@actions/core', () => ({ getInput: actionsGetInput }));
  jest.mock('path', () => ({ join: pathJoin }));
  process.env.GITHUB_WORKSPACE = GITHUB_WORKSPACE;

  beforeEach(() => {
    getActionInputs =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../../src/app/services/inputs').getActionInputs;
    pathJoin.mockReturnValue(`${GITHUB_WORKSPACE}/${INPUT_PATH_MOCK}`);
  });
  afterEach(() => jest.resetAllMocks());

  describe('getActionInputs', () => {
    describe('pathInput', () => {
      it('errors if missing', () => {
        //when
        //then
        expect(() => getActionInputs()).toThrow("Input 'path_input' empty.");
      });

      it('errors if github workspace missing', () => {
        //given
        actionsGetInput.mockReturnValue(INPUT_PATH_MOCK);
        delete process.env.GITHUB_WORKSPACE;

        //when
        //then
        expect(() => getActionInputs()).toThrow(
          "'GITHUB_WORKSPACE' variable is not set. Was checkout action done?"
        );
        process.env.GITHUB_WORKSPACE = GITHUB_WORKSPACE;
      });

      it('returns pathInput', () => {
        //given
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
        process.env.GITHUB_WORKSPACE = GITHUB_WORKSPACE;

        //when
        //then
        expect(getActionInputs()).toEqual({
          ...INPUT_EMPTY,
          pathInput: INPUT_PATH_MOCK,
        });
      });
    });

    describe('pathOutput', () => {
      it('returns empty if missing', () => {
        //given
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);

        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('returns path if present', () => {
        //given
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
        actionsGetInput.mockReturnValueOnce(OUTPUT_PATH_MOCK);
        pathJoin.mockReturnValueOnce(`${GITHUB_WORKSPACE}/${OUTPUT_PATH_MOCK}`);

        //when
        //then
        expect(getActionInputs()).toEqual({
          ...INPUT_EMPTY,
          pathOutput: `${GITHUB_WORKSPACE}/${OUTPUT_PATH_MOCK}`,
        });
      });
    });

    describe('diagramType', () => {
      const MOCK_DIAGRAM_TYPE = 'MOCK_DIAGRAM_TYPE';
      beforeEach(() => {
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
      });

      it('returns empty if missing', () => {
        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('returns type if present', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(MOCK_DIAGRAM_TYPE);

        //when
        //then
        expect(getActionInputs()).toEqual(
          expect.objectContaining({ diagramType: MOCK_DIAGRAM_TYPE })
        );
      });
    });

    describe('diagramExcludeTypes', () => {
      const MOCK_DIAGRAM_EXCLUDE_TYPE = 'MOCK_DIAGRAM_EXCLUDE_TYPE';
      beforeEach(() => {
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
      });

      it('returns empty if missing', () => {
        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('returns type if present', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(MOCK_DIAGRAM_EXCLUDE_TYPE);

        //when
        //then
        expect(getActionInputs()).toEqual(
          expect.objectContaining({
            diagramExcludeTypes: MOCK_DIAGRAM_EXCLUDE_TYPE,
          })
        );
      });
    });

    describe('diagramStacks', () => {
      const MOCK_DIAGRAM_STACKS = 'MOCK_DIAGRAM_STACKS';
      beforeEach(() => {
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
      });

      it('returns empty if missing', () => {
        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('returns type if present', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(MOCK_DIAGRAM_STACKS);

        //when
        //then
        expect(getActionInputs()).toEqual(
          expect.objectContaining({
            diagramStacks: MOCK_DIAGRAM_STACKS,
          })
        );
      });
    });

    describe('viewport', () => {
      const MOCK_VIEWPORT_HEIGHT = 100;
      const MOCK_VIEWPORT_WIDTH = 100;
      beforeEach(() => {
        actionsGetInput.mockReturnValue('');
        actionsGetInput.mockReturnValueOnce(INPUT_PATH_MOCK);
      });

      it('returns empty if missing', () => {
        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('errors if invalid number', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(OUTPUT_PATH_MOCK);

        //when
        //then
        expect(() => getActionInputs()).toThrow(
          "Input 'viewport_height' is an invalid number."
        );
      });

      it('returns empty if missing one of them', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(MOCK_VIEWPORT_HEIGHT);

        //when
        //then
        expect(getActionInputs()).toEqual(INPUT_EMPTY);
      });

      it('returns type if present', () => {
        //given
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce('');
        actionsGetInput.mockReturnValueOnce(MOCK_VIEWPORT_HEIGHT);
        actionsGetInput.mockReturnValueOnce(MOCK_VIEWPORT_WIDTH);

        //when
        //then
        expect(getActionInputs()).toEqual(
          expect.objectContaining({
            viewport: {
              height: MOCK_VIEWPORT_HEIGHT,
              width: MOCK_VIEWPORT_WIDTH,
            },
          })
        );
      });
    });
  });
});
