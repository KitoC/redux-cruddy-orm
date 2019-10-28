const get = require("lodash/get");
const isArray = require("lodash/isArray");

const handleWhere = Model => (record, where) => {
  let passes = true;

  if (where._foundIn) {
    return record._foundIn.includes(where._foundIn);
  }

  Object.entries(where).forEach(([key, value]) => {
    const recordValue = get(record, key);

    if (isArray(value) && !value.includes(recordValue)) passes = false;
    if (!isArray(value) && recordValue !== value) passes = false;
  });

  return passes;
};

module.exports = handleWhere;
