const createDb = require("../../../src/createOrm");
const { hasOne } = require("../../../src/attributeTypes");

describe("shapeReference", () => {
  const db = createDb({
    models: {
      testModel: { references: [hasOne({ model: "relatedModel" })] },
      relatedModel: {}
    }
  });

  const session = db.createSession();

  const record = { id: 1, someField: "foo" };
  const expectedShape = { id: 1, __typename: "relatedModel" };

  it("returns expected shape for related record references", () => {
    expect(
      session.Models.testModel.__private__.shapeReference(
        record,
        session.Models.relatedModel
      )
    ).toStrictEqual(expectedShape);
  });
});
