const { createPK } = require("../utils/createModel");
const { relationTypes } = require("../constants");
const isArray = require("lodash/isArray");
const mergeWith = require("lodash/mergeWith");
const isPlainObject = require("lodash/isPlainObject");
const { produce } = require("immer");

const mergeFoundIn = (objValue = [], srcValue, key) => {
  if (key === "_foundIn") {
    return objValue.concat(srcValue);
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

  if (parent) data = this.Model.__private__.addParentReference(data, parent);

  this.Model.__private__.session.setState(baseState => {
    const nextState = produce(baseState, draftState => {
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

    return nextState;
  });
}

module.exports = normalizeRecord;
