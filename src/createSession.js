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

  Object.entries(models).forEach(([key, modelValue]) => {
    const name = modelValue.name || key;
    const Model = createModel({ name, ...modelValue });

    const { Models: exclude, ...rest } = session;

    Model.upsert = actions.upsert(Model);
    Model.all = actions.all(Model);
    Model.byId = actions.byId(Model);
    Model.delete = actions.Delete(Model);
    Model.__private__ = {
      ...createPrivateMethods(Model, Models),
      session: rest
    };

    Models[name] = Model;
  });

  session.upsert = (type, data) => Models[type].upsert(data);
  session.Models = Models;

  return (state = initialState) => {
    session.state = state;

    return session;
  };
};

module.exports = createSession;
