const { createPK } = require("../../utils/createModel");
const { relationTypes } = require("../../constants");
const isArray = require("lodash/isArray");
const mergeWith = require("lodash/mergeWith");
const isPlainObject = require("lodash/isPlainObject");
const { produce } = require("immer");

// TODO: fix indexation so that foreign keys are removed if a record's related data has discrepencies...
// i.e. it used to have more of a certain record but now it is one less
const mergeFoundIn = (objValue = [], srcValue, key) => {
  if (isArray(srcValue)) {
    return srcValue;
  }
};

function normalizeRecord(record, parent) {
  let data = { ...record };

  const { value: PK } = createPK(record, this.Model.PK);

  const keys = Object.keys(data);

  this.Model.references.forEach(ref => {
    if (keys.includes(ref.as) && relationTypes[ref.relationType]) {
      const relatedData = data[ref.as];
      const RelatedModel = this.Model.__private__.session.Models[ref.model];

      RelatedModel.upsert(
        relatedData,
        this.Model.__private__.createParent({ ref, data })
      );

      if (isArray(data[ref.as])) {
        data[ref.as] = data[ref.as].map(relatedRecord =>
          this.Model.__private__.shapeReference(relatedRecord, RelatedModel)
        );
      }

      if (isPlainObject(data[ref.as])) {
        data[ref.as] = this.Model.__private__.shapeReference(
          data[ref.as],
          RelatedModel
        );
      }
    }
  });

  this.Model.__private__.session.setState(draftState => {
    if (!draftState[this.Model.name].ids.includes(PK)) {
      draftState[this.Model.name].ids.push(PK);
    }

    const existingData = draftState[this.Model.name].byId[PK] || {};

    draftState[this.Model.name].byId[PK] = mergeWith(
      existingData,
      data,
      mergeFoundIn
    );
  });
}

module.exports = normalizeRecord;
