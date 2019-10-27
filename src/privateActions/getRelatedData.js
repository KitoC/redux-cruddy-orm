const isArray = require("lodash/isArray");
const isPlainObject = require("lodash/isPlainObject");
const get = require("lodash/get");
const { relationTypes } = require("../constants");
const { createPK, createFK } = require("../utils/createModel");

function getRelatedData(record, options = {}) {
  const { withRelated } = options;
  const keys = Object.keys(record);

  const data = { ...record };
  let references = this.Model.references;

  if (isArray(withRelated)) {
    references = references.filter(({ as, model }) => {
      return withRelated.includes(model) || withRelated.includes(as);
    });
  }

  references.forEach(ref => {
    if (keys.includes(ref.as) && relationTypes[ref.relationType]) {
      const RelatedModel = this.Model.__private__.session.Models[ref.model];
      const PK = createPK(data, this.Model.PK).value;
      const parent = this.Model.__private__.createParent({
        ref,
        data
      });
      const FK = createFK({ parent, PK });

      const relatedRecords = RelatedModel.all({
        ...options,
        where: { _foundIn: FK }
      });

      if (isArray(data[ref.as])) data[ref.as] = relatedRecords;

      if (isPlainObject(data[ref.as])) {
        data[ref.as] = get(relatedRecords, "[0]", null);
      }
    }
  });

  return data;
}

module.exports = getRelatedData;
