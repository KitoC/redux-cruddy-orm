const createDb = require("../../../src/createOrm");
const { hasOne, hasMany } = require("../../../src/attributeTypes");

describe("getRelatedData", () => {
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

  const session = db.createSession();

  session.Models.parentModel.upsert(parentAData);

  const parentARecord = session.state.parentModel.byId[1];
  const { _foundIn, __typename, ...child } = session.state.childA.byId[223];

  const children = session.state.childB.ids.map(id => {
    const { _foundIn, __typename, ...childBRecord } = session.state.childB.byId[
      id
    ];
    return childBRecord;
  });

  const allRelatedExpected = { ...parentARecord, child, children };
  const specifiedRelatedExpected = { ...parentARecord, children };

  it("returns specified records if withRelated is array of model names", () => {
    expect(
      session.Models.parentModel.__private__.getRelatedData(parentARecord, {
        withRelated: ["childB"]
      })
    ).toEqual(specifiedRelatedExpected);
  });

  it("retrieves all related records if withRelated is true", () => {
    expect(
      session.Models.parentModel.__private__.getRelatedData(parentARecord)
    ).toEqual(allRelatedExpected);
  });
});
