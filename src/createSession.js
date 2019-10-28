const createModel = require("./createModel/index");
const { produce } = require("immer");
const privateMethods = require("./createModel/privateMethods");
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

  Object.entries(models).forEach(([name, modelValue]) => {
    const Model = createModel({ name, ...modelValue });

    Model.__private__ = {
      Model,
      addParentReference: privateMethods.addParentReference,
      createParent: privateMethods.createParent,
      getRelatedData: privateMethods.getRelatedData,
      handleWhere: privateMethods.handleWhere,
      normalizeRecord: privateMethods.normalizeRecord,
      shapeReference: privateMethods.shapeReference,
      session
    };

    Model.upsert = actions.upsert(Model);
    Model.all = actions.all(Model);
    Model.byId = actions.byId(Model);
    Model.delete = actions.Delete(Model);

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
