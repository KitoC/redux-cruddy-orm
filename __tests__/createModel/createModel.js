const { hasOne, hasMany, PK } = require("../../src/attribute-types");
const createDb = require("../../src/create-db");

describe("model created from createSession", () => {
  const db = createDb({
    models: {
      parentModel: {
        references: [
          hasOne({ model: "childA", as: "child" }),
          hasMany({ model: "childB", as: "children" })
        ]
      },
      childA: {},
      childB: {}
    }
  });

  const session = db.createSession();

  const parentModel = session.Models.parentModel;

  const expected = {
    name: "parentModel",
    PK: ["id"],
    references: parentModel.references,
    __private__: parentModel.__private__,
    all: parentModel.all,
    byId: parentModel.byId,
    delete: parentModel.delete,
    upsert: parentModel.upsert,
    models: parentModel.models,
    attributes: { id: PK() }
  };
  const attr = { foo: "bar", bar: "foo" };
  const childAType = { __typename: "childA" };
  const childBType = { __typename: "childB" };

  const testData = [
    {
      id: 1,
      child: { id: 1, ...attr },
      children: [{ id: 1, ...attr }, { id: 2, ...attr }, { id: 3, ...attr }]
    },
    {
      id: 2,
      child: { id: 2, ...attr },
      children: [{ id: 4, ...attr }, { id: 5, ...attr }, { id: 6, ...attr }]
    },
    {
      id: 3,
      child: { id: 3, ...attr },
      children: [{ id: 7, ...attr }, { id: 8, ...attr }, { id: 9, ...attr }]
    }
  ];

  const testDataWithTypes = [
    {
      id: 1,
      child: { id: 1, ...childAType },
      children: [
        { id: 1, ...childBType },
        { id: 2, ...childBType },
        { id: 3, ...childBType }
      ]
    },
    {
      id: 2,
      child: { id: 2, ...childAType },
      children: [
        { id: 4, ...childBType },
        { id: 5, ...childBType },
        { id: 6, ...childBType }
      ]
    },
    {
      id: 3,
      child: { id: 3, ...childAType },
      children: [
        { id: 7, ...childBType },
        { id: 8, ...childBType },
        { id: 9, ...childBType }
      ]
    }
  ];

  it("creates a model with defaults and functions added", () => {
    expect(parentModel).toEqual(expected);
  });

  describe("when no records exist", () => {
    beforeEach(() => {
      session.resetToInitialState();
    });

    describe("[MODEL].all()", () => {
      it("returns empty array", () => {
        expect(parentModel.all()).toEqual([]);
      });
    });
  });

  describe("when records exist", () => {
    beforeEach(() => {
      session.resetToInitialState();
      parentModel.upsert(testData);
    });

    describe("[MODEL].all()", () => {
      describe("DEFAULT", () => {
        it("returns recods with references to related data", () => {
          expect(parentModel.all()).toEqual(testDataWithTypes);
        });
      });

      describe("CONFIG: withRelated: true", () => {
        it("returns records with related data", () => {
          expect(parentModel.all({ withRelated: true })).toEqual(testData);
        });
      });

      describe("META", () => {
        it("deletes _foundIn from all records", () => {
          expect(
            !parentModel.all().filter(_foundIn => _foundIn !== "undefined")
          ).toEqual(false);
        });
      });
    });

    describe("[MODEL].byId()", () => {
      describe("DEFAULT", () => {
        it("returns item found by id", () => {
          expect(parentModel.byId(1)).toEqual(testDataWithTypes[0]);
        });
      });

      describe("CONFIG: withRelated: true", () => {
        it("returns item found by id with related data", () => {
          expect(parentModel.byId(1, { withRelated: true })).toEqual(
            testData[0]
          );
        });
      });
    });

    describe("[MODEL].delete()", () => {
      // TODO:
      // - CASCADE

      it("destroys a record provided an id", () => {
        expect(parentModel.delete(1)).toEqual({ success: true });
        expect(session.state.parentModel.byId[1]).toBeUndefined();
        expect(session.state.parentModel.ids.includes(1)).toBeFalsy();
      });
    });
  });
});
