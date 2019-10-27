function createAction(type, prepare = preparedPayload => preparedPayload) {
  const action = (payload = {}) => ({ type, payload: prepare(payload) });

  action.type = type;
  action.toString = () => type;

  return action;
}

module.exports = createAction;
