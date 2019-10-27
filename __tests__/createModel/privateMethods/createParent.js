const createDb = require("../../../src/createOrm");
const { hasOne } = require("../../../src/attributeTypes");

describe("createParent", () => {
  const db = createDb({
    models: {
      parentModel: {
        references: [hasOne({ model: "childModel", as: "child" })]
      },
      childModel: {}
    }
  });

  const session = db.createSession();

  const data = { id: 223 };

  const ref = {
    relationType: "hasOne",
    model: "childModel",
    as: "child",
    reference: true,
    FK: "id",
    cascade: false
  };

  const expected = { ref, data, model: "parentModel", PK: 223 };

  it("returns an object expect parent reference shape", () => {
    expect(
      session.Models.parentModel.__private__.createParent({ ref, data })
    ).toStrictEqual(expected);
  });
});
