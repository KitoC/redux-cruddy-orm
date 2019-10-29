function createRequestThunks({
  model,
  endpoint,
  axios,
  responseFormatter = res => res,
  updateMethod = "patch"
}) {
  return {
    fetch: (payload = {}) => async dispatch => {
      try {
        const { params } = payload;

        const response = await axios.get(endpoint(payload), { params });

        dispatch(model.actions.insert(responseFormatter(response)));
      } catch (error) {
        console.error(error);
        dispatch(model.actions.setErrors(error));
      }
    },

    create: (payload = {}) => async dispatch => {
      const tempId = `temp_id_${Math.random()}`;
      try {
        dispatch(model.actions.create({ ...payload, [model.PK[0]]: tempId }));

        const response = await axios.post(endpoint(payload), payload);

        dispatch(model.actions.create(responseFormatter(response)));
        dispatch(model.actions.delete(tempId));
      } catch (error) {
        console.error(error);
        dispatch(model.actions.delete(tempId));
        dispatch(model.actions.setErrors(error));
      }
    },

    update: (payload = {}) => async dispatch => {
      try {
        const response = await axios[updateMethod](endpoint(payload), payload);

        dispatch(model.actions.update(responseFormatter(response)));
      } catch (error) {
        console.error(error);
        dispatch(model.actions.setErrors(error));
      }
    },

    destroy: (payload = {}) => async dispatch => {
      try {
        await axios.delete(endpoint(payload), payload);

        dispatch(model.actions.delete(payload[model.PK[0]]));
      } catch (error) {
        console.error(error);
        dispatch(model.actions.setErrors(error));
      }
    }
  };
}

module.exports = createRequestThunks;
