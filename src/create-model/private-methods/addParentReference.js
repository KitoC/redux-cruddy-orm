const { createFK } = require("../../utils/create-model");
const merge = require("lodash/merge");

function addParentReference(record, parent) {
  const FK = { _foundIn: [createFK({ parent })] };

  return merge(FK, record);
}

module.exports = addParentReference;
