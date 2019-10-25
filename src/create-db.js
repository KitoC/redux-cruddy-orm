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

  db.models = models;
  db.createSession = createSession({ models, initialState });

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

  return db;
};

module.exports = createDB;
