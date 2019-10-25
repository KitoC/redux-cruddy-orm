const attrTypes = require("./attribute-types");
const createModel = require("./create-model");
const createDB = require("./create-db");

module.exports = { ...attrTypes, createModel, createDB };
