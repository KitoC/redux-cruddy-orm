const createOrm = require("../src/createOrm");
const createEmptyState = require("../src/utils/createEmptyState");

describe("createOrm", () => {
  const modelOne = "modelOne";
  const modelTwo = "modelTwo";
  const mockReducer = jest.fn(x => console.log("reducer hit"));
  const mockFunctionReducer = jest.fn(x => console.log("function reducer hit"));

  const orm = createOrm({
    __test__: {
      reducer: mockReducer
    },
    models: {
      [modelOne]: {},
      [modelTwo]: {}
    }
  });

  const customTestReducer = (session, action) => {
    switch (action.type) {
      case "TEST":
        mockFunctionReducer();
        break;
      default:
        break;
    }
  };

  orm.addReducer(customTestReducer);

  describe("orm.reducer", () => {
    const records = [{ id: 1 }, { id: 2 }];

    orm.reducer(orm.initialState, orm.actions[modelOne].setLoading(true));
    orm.reducer(orm.initialState, orm.actions[modelOne].create(records[0]));
    orm.reducer(orm.initialState, orm.actions[modelOne].setLoading(false));

    orm.reducer(orm.initialState, orm.actions[modelTwo].setLoading(true));
    orm.reducer(orm.initialState, orm.actions[modelTwo].create(records));
    orm.reducer(orm.initialState, { type: "TEST" });

    it("executes all orm generated reducers", () => {
      expect(mockReducer.mock.calls.length).toBe(5);
    });

    it("executes function reducers that have been added by addReducer", () => {
      expect(mockFunctionReducer.mock.calls.length).toBe(1);
    });
  });

  describe("creates an initial empty state", () => {
    const expectedInitialState = {
      [modelOne]: createEmptyState({ name: modelOne }),
      [modelTwo]: createEmptyState({ name: modelTwo })
    };

    it("executes all orm generated reducers", () => {
      expect(orm.initialState).toStrictEqual(expectedInitialState);
    });
  });
});
