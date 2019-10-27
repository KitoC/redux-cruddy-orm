const createSession = require("./createSession");
const createReducerAndActions = require("./createReducerAndActions");

const createEmptyState = ({ name }) => ({
  byId: {},
  ids: [],
  errors: [],
  loading: false,
  name
});

const createDB = (config = {}) => {
  const { models } = config;
  const db = {};
  let initialState = {};

  db.models = models;
  db.createSession = createSession({ models, initialState });
  db.reducers = [];
  db.types = {};

  Object.keys(models).forEach(key => {
    const { reducer, types } = createReducerAndActions(key);

    initialState[key] = createEmptyState({ name: key });
    db.reducers.push(reducer);
    db.types[key] = types;
  });

  db.reducer = (STATE = initialState, action) => {
    const session = db.createSession(STATE);

    db.reducers.forEach(reducer => {
      reducer(session, action);
    });

    return session.commit();
  };

  return db;
};

module.exports = createDB;
