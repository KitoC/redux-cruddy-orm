const { getReferences, getPrimaryKey } = require("./utils/createModel");

const { PK } = require("./attributeTypes");
const actions = require("./modelActions");
const privateMethods = require("./privateActions");

const defaults = { attributes: { id: PK() } };

const createModel = (model, session) => {
  const Model = model;

  Model.attributes = { ...defaults.attributes, ...Model.attributes };
  Model.references = getReferences(model);
  Model.PK = getPrimaryKey(model);

  Model.__private__ = {
    Model,
    addParentReference: privateMethods.addParentReference,
    createParent: privateMethods.createParent,
    getRelatedData: privateMethods.getRelatedData,
    handleWhere: privateMethods.handleWhere,
    normalizeRecord: privateMethods.normalizeRecord,
    shapeReference: privateMethods.shapeReference,
    session
  };

  Model.upsert = actions.upsert(Model);
  Model.all = actions.all(Model);
  Model.byId = actions.byId(Model);
  Model.delete = actions.Delete(Model);

  return Model;
};

module.exports = createModel;
