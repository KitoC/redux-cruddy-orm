const { createPK } = require("../../utils/create-model");

function shapeReference(record, RelatedModel) {
  return {
    ...createPK(record, RelatedModel.PK).object,
    __typename: RelatedModel.name
  };
}

module.exports = shapeReference;
