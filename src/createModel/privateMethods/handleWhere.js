const get = require("lodash/get");
const isArray = require("lodash/isArray");

const handleWhere = () => (record, where) => {
  let passes = true;

  Object.entries(where).forEach(([key, value]) => {
    const recordValue = get(record, key);

    if (isArray(value) && !value.includes(recordValue)) {
      passes = false;
    } else if (!isArray(value) && recordValue !== value) {
      passes = false;
    }
  });

  return passes;
};

module.exports = handleWhere;
