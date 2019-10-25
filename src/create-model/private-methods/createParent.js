const { createPK } = require("../../utils/create-model");

function createParent({ ref, data }) {
  return {
    ref,
    data,
    model: this.Model.name,
    PK: createPK(data, this.Model.PK).value
  };
}

module.exports = createParent;
