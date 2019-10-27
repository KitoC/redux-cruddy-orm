const createDb = require("../../../src/create-db");
const { hasOne, hasMany } = require("../../../src/attribute-types");

describe("normalizeRecord", () => {
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

  const parentAData = [
    {
      id: 1,
      isParent: true,
      child: { id: 223, another: "field", isChild: true },
      children: [
        { id: 222, extra: "field", isChild: true },
        { id: 223, extra: "field", isChild: true },
        { id: 234, extra: "field", isChild: true }
      ]
    }
  ];

  const createNormalizedChildB = id => ({
    id,
    extra: "field",
    isChild: true,
    _foundIn: ["parentModel.children.id.1"]
  });

  const createNormalizedChildBReference = id => ({ id, __typename: "childB" });

  const expectedState = {
    parentModel: {
      byId: {
        "1": {
          id: 1,
          isParent: true,
          child: { id: 223, __typename: "childA" },
          children: [
            createNormalizedChildBReference(222),
            createNormalizedChildBReference(223),
            createNormalizedChildBReference(234)
          ]
        }
      },
      ids: [1],
      errors: [],
      name: "parentModel",
      loading: false
    },
    childA: {
      byId: {
        "223": {
          id: 223,
          another: "field",
          isChild: true,
          _foundIn: ["parentModel.child.id.1"]
        }
      },
      ids: [223],
      errors: [],
      name: "childA",
      loading: false
    },
    childB: {
      byId: {
        "222": createNormalizedChildB(222),
        "223": createNormalizedChildB(223),
        "234": createNormalizedChildB(234)
      },
      ids: [222, 223, 234],
      errors: [],
      name: "childB",
      loading: false
    }
  };

  it("normalizes an array of data into expected state shape", () => {
    session.Models.parentModel.upsert(parentAData);

    expect(session.state).toStrictEqual(expectedState);
  });
});
