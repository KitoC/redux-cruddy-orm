const { getReferences, getPrimaryKey } = require("../utils/createModel");

const { PK } = require("../attributeTypes");
const createReducerAndActions = require("../createReducerAndActions");
const createRequestThunks = require("./createRequestThunks");
const defaults = { attributes: { id: PK() } };

const createModel = model => {
  const Model = model;

  const reducerAndActions = createReducerAndActions(
    model.name,
    model,
    model.__test__
  );

  Model.reducer = reducerAndActions.reducer;
  Model.actions = reducerAndActions.actions;
  Model.attributes = { ...defaults.attributes, ...Model.attributes };
  Model.references = getReferences(model);
  Model.PK = getPrimaryKey(model);
  Model.createRequestThunks = createRequestThunks;

  Model.createRequestThunks({ endpoint: "/", axios: () => {} });

  return Model;
};

module.exports = createModel;
