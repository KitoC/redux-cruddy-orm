function createAction(MODEL) {
  // const MODEL = Model.name;
  console.log(MODEL);

  const types = {
    FETCH_DONE: `CRUDDY_ORM_FETCH_DONE_${MODEL}`,
    UPDATE: `CRUDDY_ORM_UPDATE_${MODEL}`,
    INSERT: `CRUDDY_ORM_INSERT_${MODEL}`,
    CREATE: `CRUDDY_ORM_CREATE_${MODEL}`,
    DELETE: `CRUDDY_ORM_DELETE_${MODEL}`
  };

  const reducer = (session, action) => {
    switch (action.type) {
      case types.FETCH_DONE:
      case types.UPDATE:
      case types.INSERT:
      case types.CREATE:
        session.Models[MODEL].upsert(action.payload);
        break;
      case types.DELETE:
        session.Models[MODEL].delete(action.payloadp[Model.PK[0]]);
        break;
      default:
        break;
    }
  };

  return { reducer, types };
}

module.exports = createAction;
