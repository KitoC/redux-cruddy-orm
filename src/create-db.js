const createSession = require("./create-session");

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

  Object.keys(models).forEach(
    key => (initialState[key] = createEmptyState({ name: key }))
  );

  // const setState = callback => (newState = callback(newState));
  // const getState = () => newState;
  // const getInitialState = () => initialState;

  db.models = models;
  db.createSession = createSession({ models, initialState });

  // db.__private__ = {
  //   setState,
  //   getState,
  //   getInitialState
  // };

  // const commit = () => newState;

  // const upsert = (type, data) => Models[type].upsert(data);

  // db.createSession = (currentState = initialState) => {
  //   newState = currentState;

  //   return { ...Models, upsert, commit, state: newState };
  // };

  db.combineReducers = () => {
    return (STATE = initialState, action) => {
      // console.log({ STATE, action });
      switch (action.type) {
        case "DB_TRIPS_UPSERT":
          const session = createSession(STATE);

          session.trips.upsert(action.payload);

          return session.commit();
        // return STATE;
        default:
          return STATE;
      }
    };
  };

  // db.registerModels = (...models) => {
  //   models.forEach(model => {
  //     const { name } = model;

  //     // newState[name] = emptyState(model);
  //     initialState[name] = emptyState(model);

  //     Models[name] = model;

  //     Models[name].db = db;
  //     Models[name].__private__.setState = setState;
  //     Models[name].__private__.getState = getState;
  //     Models[name].__private__.models = Models;
  //   });
  // };

  return db;
  // return { getInitialState, registerModels, createSession, combineReducers };
};

module.exports = createDB;
