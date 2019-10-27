const createDb = require("../../../src/create-db");
const { hasOne } = require("../../../src/attribute-types");

describe("addParentReference", () => {
  const db = createDb({
    models: {
      parentModel: {
        references: [hasOne({ model: "childModel", as: "child" })]
      },
      childModel: {}
    }
  });

  const session = db.createSession();
  const parentModel = session.Models.parentModel;
  const ref = parentModel.references[0];

  const data = { id: 223 };
  const record = { id: 100 };

  const parent = parentModel.__private__.createParent({ ref, data });

  const expected = {
    id: 100,
    _foundIn: ["parentModel.child.id.223"]
  };

  it("adds a FK reference from parent into the _foundIn array on child", () => {
    expect(
      session.Models.childModel.__private__.addParentReference(record, parent)
    ).toStrictEqual(expected);
  });
});
