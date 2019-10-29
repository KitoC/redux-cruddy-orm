const { createORM, createRequestThunks, createModel } = require("../src");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { configureMockStore } = require("redux-mock-store");
const thunk = require("redux-thunk");
const mockStore = configureMockStore([thunk]);

// This sets the mock adapter on the default instance
const mockAxios = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mockAxios.onGet("/testModel").reply(200, [
  {
    id: 1,
    foo: "bar"
  }
]);

describe("createRequestThunks", () => {
  const testModel = createModel({ name: "testModel" });

  const orm = createORM({
    models: { testModel }
  });

  const tesModelThunks = createRequestThunks({
    model: createRequestThunks,
    axios: mockAxios,
    endpoint: () => "/endpoint"
  });

  const expectedShape = {
    fetch: tesModelThunks.fetch,
    create: tesModelThunks.create,
    update: tesModelThunks.update,
    destroy: tesModelThunks.destroy
  };

  describe("when invoked", () => {
    it("returns expected api methods", () => {
      expect(tesModelThunks).toStrictEqual(expectedShape);
    });
  });

  describe("fetch", () => {
    it("fetches data and normalise to store", async () => {
      await mockStore.dispatch(tesModelThunks.fetch());

      const actions = mockStore.getActions();

      expect(actions[0]).toEqual({ type: "orm/default/testModel/insert" });
    });
  });
});
