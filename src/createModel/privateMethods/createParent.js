const { createPK } = require("../../utils/createModel");

const createParent = Model => ({ ref, data }) => {
  return {
    ref,
    data,
    model: Model.name,
    PK: createPK(data, Model.PK).value
  };
};

module.exports = createParent;
