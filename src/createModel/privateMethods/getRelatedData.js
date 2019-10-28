const isArray = require("lodash/isArray");
const isPlainObject = require("lodash/isPlainObject");
const get = require("lodash/get");
const { relationTypes } = require("../../constants");
const { createPK, createFK } = require("../../utils/createModel");

const getRelatedData = (Model, Models) => (record, options = {}) => {
  const { withRelated } = options;
  const keys = Object.keys(record);

  const data = { ...record };
  let references = Model.references;

  if (isArray(withRelated)) {
    references = references.filter(({ as, model }) => {
      return withRelated.includes(model) || withRelated.includes(as);
    });
  }

  references.forEach(ref => {
    if (keys.includes(ref.as) && relationTypes[ref.relationType]) {
      const RelatedModel = Models[ref.model];

      const getRelatedPK = ({ [RelatedModel.PK[0]]: pk }) => pk;

      if (isArray(data[ref.as])) {
        data[ref.as] = record[ref.as].map(entity =>
          RelatedModel.byId(getRelatedPK(entity), options)
        );
      }

      if (isPlainObject(data[ref.as])) {
        data[ref.as] = RelatedModel.byId(getRelatedPK(data[ref.as]), options);
      }
    }
  });

  return data;
};

module.exports = getRelatedData;
