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
  orm.types = {};
  orm.actions = {};

  Object.entries(models).forEach(([key, model]) => {
    const { reducer, types, actions } = createReducerAndActions(
      key,
      model,
      __test__
    );

    initialState[key] = createEmptyState({ name: key });
    orm.reducers.push(reducer);
    orm.types[key] = types;
    orm.actions[key] = actions;
  });

  orm.addReducer = reducer => orm.reducers.push(reducer);

  orm.reducer = (STATE = initialState, action) => {
    const session = orm.createSession(STATE);

    flatten(orm.reducers).forEach(reducer => {
      if (isFunction(reducer)) reducer(session, action);
      if (isPlainObject(reducer) && isFunction(reducer[action.type])) {
        reducer[action.type](session, action);
      }
    });

    return session.commit();
  };

  return orm;
};

module.exports = createDB;
