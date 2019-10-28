const createParent = require("./createParent");
const getRelatedData = require("./getRelatedData");
const handleWhere = require("./handleWhere");
const normalizeRecord = require("./normalizeRecord");
const shapeReference = require("./shapeReference");

const createPrivateFunctions = (Model, Models) => ({
  createParent: createParent(Model, Models),
  getRelatedData: getRelatedData(Model, Models),
  handleWhere: handleWhere(Model, Models),
  normalizeRecord: normalizeRecord(Model, Models),
  shapeReference: shapeReference(Model, Models)
});

module.exports = createPrivateFunctions;
