const attrTypes = require("./attributeTypes");
const createORM = require("./createOrm");
const createModel = require("./createModel");

module.exports = { ...attrTypes, createORM, createModel };
