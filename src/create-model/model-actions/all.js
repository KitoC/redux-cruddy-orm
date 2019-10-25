const all = Model => (options = {}) => {
  const { withRelated, where = {} } = options;

  const modelState = Model.__private__.session.getState()[Model.name];

  return modelState.ids
    .filter(id => {
      const record = modelState.byId[id];
      return Model.__private__.handleWhere(record, where);
    })
    .map(id => {
      let record = { ...modelState.byId[id] };

      if (withRelated)
        record = Model.__private__.getRelatedData(record, options);

      delete record._foundIn;

      return record;
    });
};

module.exports = all;
