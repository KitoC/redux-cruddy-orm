const createAction = require("./createAction");
const get = require("lodash/get");

function createReducerAndActions(MODEL, model = {}, __test__ = {}) {
  const { overrides = {} } = model;
  const type = t => `orm/default/${MODEL}/${t}`;

  const setLoading = createAction(
    type("setLoading"),
    get(overrides, "setLoading.actionPrepare")
  );
  const setErrors = createAction(
    type("setErrors"),
    get(overrides, "setErrors.actionPrepare")
  );
  const update = createAction(
    type("update"),
    get(overrides, "update.actionPrepare")
  );
  const insert = createAction(
    type("insert"),
    get(overrides, "insert.actionPrepare")
  );
  const create = createAction(
    type("create"),
    get(overrides, "create.actionPrepare")
  );
  const destroy = createAction(
    type("destroy"),
    get(overrides, "destroy.actionPrepare")
  );

  const actions = {
    setLoading,
    setErrors,
    update,
    insert,
    create,
    delete: destroy
  };

  const reducer = {};

  reducer[setLoading] = (session, { payload }) => {
    if (__test__.reducer) __test__.reducer();

    session.setState(draftState => {
      draftState[MODEL].loading = payload;
    });
  };

  reducer[setErrors] = (session, { payload }) => {
    if (__test__.reducer) __test__.reducer();

    session.setState(draftState => {
      draftState[MODEL].errors = payload;
    });
  };

  const upsert = (session, { payload }) => {
    if (__test__.reducer) __test__.reducer();

    session.Models[MODEL].upsert(payload);
  };

  reducer[create] = upsert;
  reducer[insert] = upsert;
  reducer[update] = upsert;

  reducer[destroy] = (session, { payload }) => {
    session.Models[MODEL].delete(payload);
  };

  return { reducer, actions };
}

module.exports = createReducerAndActions;
