const { createPK } = require("../../utils/createModel");

const shapeReference = Model => (record, relatedModel) => {
  return {
    ...createPK(record, relatedModel.PK).object,
    __typename: relatedModel.name
  };
};

module.exports = shapeReference;
