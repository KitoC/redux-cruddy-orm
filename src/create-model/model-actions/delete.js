const { produce } = require("immer");

const Delete = Model => (id, options = {}) => {
  Model.__private__.session.setState(baseState => {
    const nextState = produce(baseState, draftState => {
      draftState[Model.name].ids = draftState[Model.name].ids.filter(
        ID => ID !== id
      );

      delete draftState[Model.name].byId[id];
    });

    return nextState;
  });

  return { success: true };
};

module.exports = Delete;
