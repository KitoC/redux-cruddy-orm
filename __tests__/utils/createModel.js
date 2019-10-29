const {
  createPK,
  getReferences,
  createFK,
  getPrimaryKey
} = require("../../src/utils/createModel");
const { relationTypes, attributeTypes } = require("../../src/constants");
const { hasOne, hasMany, primaryKey } = require("../../src/attributeTypes");

describe("createPK", () => {
  const record = { id: 1 };
  const PKs = ["id"];
  const expected = { value: 1, object: { id: 1 } };

  it("generates a value and object primaryKey", () => {
    expect(createPK(record, PKs)).toStrictEqual(expected);
  });
});

describe("createFK", () => {
  const parent = {
    model: "model_name",
    PK: 321,
    ref: { as: "model_names", FK: "id" }
  };

  const expected = "model_name.model_names.id.321";

  it("generates a FK reference", () => {
    expect(createFK({ parent })).toStrictEqual(expected);
  });
});

describe("getPrimaryKey", () => {
  const modelConfig = { name: "model_name", attributes: { id: primaryKey() } };

  const expected = ["id"];

  it("extracts primaryKey from model config", () => {
    expect(getPrimaryKey(modelConfig)).toStrictEqual(expected);
  });
});

describe("getReferences", () => {
  const references = [
    hasOne({ model: "related_one" }),
    hasMany({ model: "related_two" })
  ];

  const defaults = { FK: "id", cascade: false, reference: true };

  const expected = [
    {
      model: "related_one",
      as: "related_one",
      relationType: relationTypes.hasOne,
      ...defaults
    },
    {
      model: "related_two",
      as: "related_two",
      relationType: relationTypes.hasMany,
      ...defaults
    }
  ];

  const modelConfig = { name: "model_name" };

  it("extracts references from model.attributes if defined", () => {
    modelConfig.attributes = {
      related_one: references[0],
      related_two: references[1]
    };

    expect(getReferences(modelConfig)).toStrictEqual(expected);
  });

  it("extracts references from model.references if defined", () => {
    modelConfig.references = references;

    expect(getReferences(modelConfig)).toStrictEqual(expected);
  });
});
