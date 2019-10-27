const isArray = require("lodash/isArray");
const isPlainObject = require("lodash/isPlainObject");

const upsert = Model => (data, parent) => {
  if (isArray(data)) {
    data.forEach(record => Model.__private__.normalizeRecord(record, parent));
  }
  if (isPlainObject(data)) Model.__private__.normalizeRecord(data, parent);
};

module.exports = upsert;
