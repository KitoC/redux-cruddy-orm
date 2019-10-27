const createReducerAndActions = require("../src/createReducerAndActions");
const createOrm = require("../src/createOrm");
const isFunction = require("lodash/isFunction");

describe("createReducerAndActions", () => {
  const MODEL = "myNewModel";
  const reducersAndActions = createReducerAndActions(MODEL);

  describe("expected shapes", () => {
    describe("default", () => {
      it("returns an object with reducer and actions keys", () => {
        expect(reducersAndActions).toHaveProperty("reducer");
        expect(reducersAndActions).toHaveProperty("actions");
        expect(Object.keys(reducersAndActions).length).toBe(2);
      });
    });
  });

  describe("actions object", () => {
    const { actions } = reducersAndActions;

    const actionsExpectedShape = {
      setLoading: true,
      setErrors: true,
      update: true,
      insert: true,
      create: true,
      delete: true
    };

    const actionsShape = {
      setLoading: isFunction(actions.setLoading),
      setErrors: isFunction(actions.setErrors),
      update: isFunction(actions.update),
      insert: isFunction(actions.insert),
      create: isFunction(actions.create),
      delete: isFunction(actions.delete)
    };

    it("returns expected shape with functions as values", () => {
      expect(actionsShape).toStrictEqual(actionsExpectedShape);
    });
  });

  describe("reducer object", () => {
    const { reducer, actions } = reducersAndActions;

    const reducerExpectedShape = {
      [actions.setLoading]: true,
      [actions.setErrors]: true,
      [actions.update]: true,
      [actions.insert]: true,
      [actions.create]: true,
      [actions.delete]: true
    };

    const reducerShape = {
      [actions.setLoading]: isFunction(reducer[actions.setLoading]),
      [actions.setErrors]: isFunction(reducer[actions.setErrors]),
      [actions.update]: isFunction(reducer[actions.update]),
      [actions.insert]: isFunction(reducer[actions.insert]),
      [actions.create]: isFunction(reducer[actions.create]),
      [actions.delete]: isFunction(reducer[actions.delete])
    };

    it("returns expected shape with functions as values", () => {
      expect(reducerShape).toStrictEqual(reducerExpectedShape);
    });
  });

  describe("auto generated reducers", () => {
    const db = createOrm({ models: { [MODEL]: {} } });
    const { reducer, actions } = reducersAndActions;

    const session = db.createSession();

    beforeEach(() => {
      session.resetToInitialState();
    });

    describe("setLoading", () => {
      const setLoading = actions.setLoading;

      it("sets loading state of model", () => {
        reducer[setLoading](session, setLoading(true));

        expect(session.state[MODEL].loading).toBeTruthy();

        reducer[setLoading](session, setLoading(false));

        expect(session.state[MODEL].loading).toBeFalsy();
      });
    });

    describe("setErrors", () => {
      const setErrors = actions.setErrors;
      const expected = ["This is an error."];

      it("sets errors state of model", () => {
        reducer[setErrors](session, setErrors(expected));

        expect(session.state[MODEL].errors).toStrictEqual(expected);
      });
    });

    describe("insert one record", () => {
      const insert = actions.insert;
      const record = { id: 111, foo: "bar" };
      const expectedById = record;

      it("adds a single record to byId in model state", () => {
        reducer[insert](session, insert(record));

        expect(session.state[MODEL].byId[111]).toStrictEqual(expectedById);
      });

      it("adds a single record id to ids in model state", () => {
        reducer[insert](session, insert(record));

        expect(session.state[MODEL].ids).toStrictEqual([record.id]);
      });
    });

    describe("insert multiple records", () => {
      const insert = actions.insert;
      const recordOne = { id: 112, foo: "fizz" };
      const recordTwo = { id: 113, foo: "buzz" };
      const recordThree = { id: 114, foo: "fizz" };
      const multipleRecords = [recordOne, recordTwo, recordThree];
      const expectedIds = [recordOne.id, recordTwo.id, recordThree.id];

      it("adds a multiple records to byId in model state", () => {
        reducer[insert](session, insert(multipleRecords));

        expect(session.state[MODEL].byId[112]).toStrictEqual(recordOne);
        expect(session.state[MODEL].byId[113]).toStrictEqual(recordTwo);
        expect(session.state[MODEL].byId[114]).toStrictEqual(recordThree);
      });

      it("adds a multiple records id to ids in model state", () => {
        reducer[insert](session, insert(multipleRecords));

        expect(session.state[MODEL].ids).toStrictEqual(expectedIds);
      });
    });

    describe("create one record", () => {
      const create = actions.create;
      const record = { id: 111, foo: "bar" };
      const expectedById = record;

      it("adds a single record to byId in model state", () => {
        reducer[create](session, create(record));

        expect(session.state[MODEL].byId[111]).toStrictEqual(expectedById);
      });

      it("adds a single record id to ids in model state", () => {
        reducer[create](session, create(record));

        expect(session.state[MODEL].ids).toStrictEqual([record.id]);
      });
    });

    describe("create multiple records", () => {
      const create = actions.create;
      const recordOne = { id: 112, foo: "fizz" };
      const recordTwo = { id: 113, foo: "buzz" };
      const recordThree = { id: 114, foo: "fizz" };
      const multipleRecords = [recordOne, recordTwo, recordThree];
      const expectedIds = [recordOne.id, recordTwo.id, recordThree.id];

      it("adds a multiple records to byId in model state", () => {
        reducer[create](session, create(multipleRecords));

        expect(session.state[MODEL].byId[112]).toStrictEqual(recordOne);
        expect(session.state[MODEL].byId[113]).toStrictEqual(recordTwo);
        expect(session.state[MODEL].byId[114]).toStrictEqual(recordThree);
      });

      it("adds a multiple records id to ids in model state", () => {
        reducer[create](session, create(multipleRecords));

        expect(session.state[MODEL].ids).toStrictEqual(expectedIds);
      });
    });

    describe("update one record", () => {
      const create = actions.create;
      const update = actions.update;
      const record = { id: 111, foo: "bar" };
      const updatedRecord = { id: 111, foo: "updated" };
      const expectedById = updatedRecord;

      reducer[create](session, create(record));

      it("adds a single record to byId in model state", () => {
        reducer[update](session, update(updatedRecord));

        expect(session.state[MODEL].byId[111]).toStrictEqual(expectedById);
      });
    });

    describe("update multiple records", () => {
      const create = actions.create;
      const update = actions.update;
      const recordOne = { id: 112, foo: "fizz" };
      const recordTwo = { id: 113, foo: "buzz" };
      const recordThree = { id: 114, foo: "fizz" };
      const updatedRecordOne = { id: 112, foo: "updated 112" };
      const updatedRecordTwo = { id: 113, foo: "updated 113" };
      const updatedRecordThree = { id: 114, foo: "updated 114" };
      const multipleRecords = [recordOne, recordTwo, recordThree];
      const multipleUpdatedRecords = [
        updatedRecordOne,
        updatedRecordTwo,
        updatedRecordThree
      ];

      reducer[create](session, create(multipleRecords));

      it("adds a multiple records to byId in model state", () => {
        reducer[update](session, update(multipleUpdatedRecords));

        expect(session.state[MODEL].byId[112]).toStrictEqual(updatedRecordOne);
        expect(session.state[MODEL].byId[113]).toStrictEqual(updatedRecordTwo);
        expect(session.state[MODEL].byId[114]).toStrictEqual(
          updatedRecordThree
        );
      });
    });

    describe("delete one record", () => {
      const create = actions.create;
      const record = { id: 111, foo: "bar" };

      reducer[create](session, create(record));
      reducer[actions.delete](session, actions.delete(111));

      it("removes a record from the byId state", () => {
        expect(session.state[MODEL].byId[111]).toBeUndefined();
      });

      it("removes a record from the ids state", () => {
        expect(session.state[MODEL].ids).toStrictEqual([]);
      });
    });

    describe("update multiple records", () => {
      const create = actions.create;
      const recordOne = { id: 112, foo: "fizz" };
      const recordTwo = { id: 113, foo: "buzz" };
      const recordThree = { id: 114, foo: "fizz" };
      const multipleRecords = [recordOne, recordTwo, recordThree];

      reducer[create](session, create(multipleRecords));

      reducer[actions.delete](session, actions.delete([112, 113]));

      it("removes multiple records from the byId state", () => {
        reducer[create](session, create(multipleRecords));

        reducer[actions.delete](session, actions.delete([112, 113]));

        expect(session.state[MODEL].byId[112]).toBeUndefined();
        expect(session.state[MODEL].byId[113]).toBeUndefined();
      });

      it("removes multiple records from the ids state", () => {
        reducer[create](session, create(multipleRecords));

        reducer[actions.delete](session, actions.delete([112, 113]));

        expect(session.state[MODEL].ids).toStrictEqual([114]);
      });
    });
  });
});
