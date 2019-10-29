const createSession = require("./createSession");
const createReducerAndActions = require("./createReducerAndActions");
const isFunction = require("lodash/isFunction");
const isPlainObject = require("lodash/isPlainObject");
const flatten = require("lodash/flatten");
const createEmptyState = require("./utils/createEmptyState");

const createDB = (config = {}) => {
  const { models, __test__ } = config;
  const orm = {};
  let initialState = {};

  orm.initialState = initialState;
  orm.models = models;
  orm.createSession = createSession({ models, initialState });
  orm.reducers = [];
  orm.actions = {};

  Object.entries(models).forEach(([key, model]) => {
    const name = model.name || key;

    const { reducer, actions } = createReducerAndActions(name, model, __test__);

    initialState[name] = createEmptyState({ name });
    orm.reducers.push(reducer);
    orm.actions[name] = actions;
  });

  orm.addReducer = reducer => orm.reducers.push(reducer);

  orm.reducer = (STATE = initialState, action) => {
    let session = orm.createSession(STATE);

    flatten(orm.reducers).forEach(reducer => {
      if (isFunction(reducer)) reducer(session, action);
      if (isPlainObject(reducer) && isFunction(reducer[action.type])) {
        reducer[action.type](session, action);
      }
    });

    const newState = session.commit();

    session = null;

    return newState;
  };

  return orm;
};

module.exports = createDB;
