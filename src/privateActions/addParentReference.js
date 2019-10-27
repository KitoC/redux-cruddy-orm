const { createFK } = require("../utils/createModel");
const merge = require("lodash/merge");

function addParentReference(record, parent) {
  const FK = { _foundIn: [createFK({ parent })] };

  return merge(FK, record);
}

module.exports = addParentReference;
