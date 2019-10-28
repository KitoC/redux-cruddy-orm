const { createPK } = require("../../utils/createModel");

const shapeReference = Model => (record, RelatedModel) => {
  return {
    ...createPK(record, RelatedModel.PK).object,
    __typename: RelatedModel.name
  };
};

module.exports = shapeReference;
