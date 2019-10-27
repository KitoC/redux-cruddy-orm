const isNumber = require("lodash/isNumber");
const isArray = require("lodash/isArray");

const Delete = Model => (payload, options = {}) => {
  const idsOrRecords = isArray(payload) ? payload : [payload];
  const ids = idsOrRecords.map(idOrRecord =>
    isNumber(idOrRecord) ? idOrRecord : idOrRecord[Model.PK[0]]
  );

  Model.__private__.session.setState(draftState => {
    draftState[Model.name].ids = draftState[Model.name].ids.filter(
      id => !ids.includes(id)
    );

    ids.forEach(id => {
      delete draftState[Model.name].byId[id];
    });
  });

  return { success: true };
};

module.exports = Delete;
