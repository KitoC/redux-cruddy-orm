function createRequestThunks({
  endpoint,
  axios,
  responseFormatter = res => res
}) {
  return {
    fetch: (payload = {}) => async dispatch => {
      try {
        const { [this.PK[0]]: id, params } = payload;
        const response = await axios.get(endpoint(payload), { params });

        dispatch(this.actions.insert(responseFormatter(response)));
      } catch (err) {
        console.error(err);
        dispatch(this.actions.setErrors(err.toString()));
      }
    },

    create: (payload = {}) => async dispatch => {
      const tempId = `temp_id_${Math.random()}`;
      try {
        dispatch(this.actions.create({ ...payload, [this.PK[0]]: tempId }));

        const response = await axios.post(endpoint(payload), payload);

        dispatch(this.actions.create(responseFormatter(response)));
        dispatch(this.actions.delete(tempId));
      } catch (err) {
        dispatch(this.actions.delete(tempId));
        dispatch(this.actions.setErrors(err.toString()));
      }
    },

    update: (payload = {}) => async dispatch => {
      try {
        const response = await axios.patch(endpoint(payload), payload);

        dispatch(this.actions.update(responseFormatter(response)));
      } catch (err) {
        dispatch(this.actions.setErrors(err.toString()));
      }
    },

    destroy: (payload = {}) => async dispatch => {
      try {
        await axios.delete(endpoint(payload), payload);

        dispatch(this.actions.delete(payload[this.PK[0]]));
      } catch (err) {
        dispatch(this.actions.setErrors(err.toString()));
      }
    }
  };
}

module.exports = createRequestThunks;
