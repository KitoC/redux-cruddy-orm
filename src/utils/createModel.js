const { attributeTypes } = require("../constants");

const getReferences = model => {
  if (model.references) return model.references;

  return Object.entries(model.attributes)
    .filter(([key, value]) => value.reference)
    .map(([key, value]) => ({ ...value }));
};

const createPK = (record, PKs) => {
  const PK = PKs[0];
  let value = record[PK];
  const object = { [PK]: record[PK] };

  return { value, object };
};

const createFK = ({ parent }) =>
  `${parent.model}.${parent.ref.as}.${parent.ref.FK}.${parent.PK}`;

const getPrimaryKey = model =>
  Object.entries(model.attributes)
    .filter(([key, value]) => value.type === attributeTypes.PK)
    .map(([key]) => key);

module.exports = { getReferences, createPK, createFK, getPrimaryKey };
