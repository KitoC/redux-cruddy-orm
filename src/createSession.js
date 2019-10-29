const createModel = require("./createModel/index");
const { produce } = require("immer");
const createPrivateMethods = require("./createModel/privateMethods");
const actions = require("./createModel/modelActions");

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

  Object.entries(models).forEach(([key, modelConfig]) => {
    const name = modelConfig.name || key;
    const model = createModel({ name, ...modelConfig });

    const { Models: exclude, ...rest } = session;

    model.upsert = actions.upsert(model);
    model.all = actions.all(model);
    model.byId = actions.byId(model);
    model.delete = actions.Delete(model);
    model.__private__ = {
      ...createPrivateMethods(model, Models),
      session: rest
    };

    Models[name] = model;
  });

  session.upsert = (type, data) => Models[type].upsert(data);
  session.Models = Models;

  return (state = initialState) => {
    session.state = state;

    return session;
  };
};

module.exports = createSession;
