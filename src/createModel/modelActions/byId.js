const byId = Model => (id, options = {}) => {
  const { withRelated } = options;

  const modelState = Model.__private__.session.getState()[Model.name];

  let record = { ...modelState.byId[id] };

  if (withRelated) record = Model.__private__.getRelatedData(record, options);

  return record;
};

module.exports = byId;
