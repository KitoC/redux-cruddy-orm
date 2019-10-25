const { hasOne, hasMany, PK } = require("../../src/attribute-types");
const createDb = require("../../src/create-db");

describe("model created from createSession", () => {
  const db = createDb({ models: { testModel: {} } });

  const session = db.createSession();

  const testModel = session.Models.testModel;

  const expected = {
    name: "testModel",
    PK: ["id"],
    references: [],
    __private__: testModel.__private__,
    all: testModel.all,
    byId: testModel.byId,
    delete: testModel.delete,
    upsert: testModel.upsert,
    models: testModel.models,
    attributes: { id: PK() }
  };

  it("creates a model with defaults and functions added", () => {
    expect(testModel).toEqual(expected);
  });

  describe("testModel.all()", () => {
    it("returns empty array when no records", () => {
      expect(testModel.all()).toEqual([]);
    });

    it("returns array with records that have been upserted", () => {
      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(testModel.all()).toEqual(records);
    });

    it("deletes _foundIn from all records", () => {
      // TODO:
      // - withRelated

      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(
        !testModel.all().filter(_foundIn => _foundIn !== "undefined")
      ).toEqual(false);
    });
  });

  describe("testModel.byId()", () => {
    // TODO:
    // - withRelated

    it("returns item found by id", () => {
      const records = { id: 1 };

      testModel.upsert(records);

      expect(testModel.byId(1)).toEqual(records);
    });
  });

  describe("testModel.delete()", () => {
    // TODO:
    // - CASCADE

    it("destroys a record provided an id", () => {
      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(testModel.delete(1)).toEqual({ success: true });
      expect(session.state.testModel.byId[1]).toBeUndefined();
      expect(session.state.testModel.ids.includes(1)).toBeFalsy();
    });
  });
});

describe("model with related data created from createSession", () => {
  const db = createDb({ models: { testModel: {} } });

  const session = db.createSession();

  const testModel = session.Models.testModel;

  const expected = {
    name: "testModel",
    PK: ["id"],
    references: [],
    __private__: testModel.__private__,
    all: testModel.all,
    byId: testModel.byId,
    delete: testModel.delete,
    upsert: testModel.upsert,
    models: testModel.models,
    attributes: { id: PK() }
  };

  it("creates a model with defaults and functions added", () => {
    expect(testModel).toEqual(expected);
  });

  describe("testModel.all()", () => {
    it("returns empty array when no records", () => {
      expect(testModel.all()).toEqual([]);
    });

    it("returns array with records that have been upserted", () => {
      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(testModel.all()).toEqual(records);
    });

    it("deletes _foundIn from all records", () => {
      // TODO:
      // - withRelated

      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(
        !testModel.all().filter(_foundIn => _foundIn !== "undefined")
      ).toEqual(false);
    });
  });

  describe("testModel.byId()", () => {
    // TODO:
    // - withRelated

    it("returns item found by id", () => {
      const records = { id: 1 };

      testModel.upsert(records);

      expect(testModel.byId(1)).toEqual(records);
    });
  });

  describe("testModel.delete()", () => {
    // TODO:
    // - CASCADE

    it("destroys a record provided an id", () => {
      const records = [{ id: 1 }];

      testModel.upsert(records);

      expect(testModel.delete(1)).toEqual({ success: true });
      expect(session.state.testModel.byId[1]).toBeUndefined();
      expect(session.state.testModel.ids.includes(1)).toBeFalsy();
    });
  });
});
