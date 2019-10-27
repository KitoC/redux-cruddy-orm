const { createPK } = require("../../utils/createModel");

function shapeReference(record, RelatedModel) {
  return {
    ...createPK(record, RelatedModel.PK).object,
    __typename: RelatedModel.name
  };
}

module.exports = shapeReference;
