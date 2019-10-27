const createModel = require("./createModel/index");
const { produce } = require("immer");

const createSession = config => {
  const { models, initialState } = config;
  const Models = {};
  const session = {};

  session.getState = () => session.state;
  session.commit = () => session.state;
  session.setState = callback => {
    session.state = produce(session.state, callback);
  };

  session.resetToInitialState = () => (session.state = initialState);

  Object.entries(models).forEach(([name, options]) => {
    Models[name] = createModel({ name, ...options }, session);
  });

  session.upsert = (type, data) => Models[type].upsert(data);
  session.Models = Models;

  return (state = initialState) => {
    session.state = state;

    return session;
  };
};

module.exports = createSession;
