const { getReferences, getPrimaryKey } = require("../utils/createModel");

const { primaryKey } = require("../attributeTypes");
const createReducerAndActions = require("../createReducerAndActions");

const defaults = { attributes: { id: primaryKey() } };

const createModel = modelConfig => {
  const model = modelConfig;

  const reducerAndActions = createReducerAndActions(
    modelConfig.name,
    modelConfig,
    modelConfig.__test__
  );

  model.reducer = reducerAndActions.reducer;
  model.actions = reducerAndActions.actions;
  model.attributes = { ...defaults.attributes, ...model.attributes };
  model.references = getReferences(modelConfig);
  model.PK = getPrimaryKey(modelConfig);

  return model;
};

module.exports = createModel;
