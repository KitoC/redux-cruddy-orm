const { createPK } = require("../../utils/createModel");
const { relationTypes } = require("../../constants");
const isArray = require("lodash/isArray");
const mergeWith = require("lodash/mergeWith");
const isPlainObject = require("lodash/isPlainObject");

const mergeFoundIn = (objValue = [], srcValue) => {
  if (isArray(srcValue)) {
    return srcValue;
  }
};

const normalizeRecord = (Model, Models) => record => {
  try {
    let data = { ...record };

    const { value: PK } = createPK(record, Model.PK);

    const keys = Object.keys(data);

    Model.references.forEach(ref => {
      if (keys.includes(ref.as) && relationTypes[ref.relationType]) {
        const relatedData = data[ref.as];
        const RelatedModel = Models[ref.model];

        if (!RelatedModel) {
          throw new Error(
            `You are attempting to use a related model that thas not been defined yet - check "${ref.model}" on "${Model.name}"`
          );
        }

        RelatedModel.upsert(
          relatedData,
          Model.__private__.createParent({ ref, data })
        );

        if (isArray(data[ref.as])) {
          data[ref.as] = data[ref.as].map(relatedRecord =>
            Model.__private__.shapeReference(relatedRecord, RelatedModel)
          );
        }

        if (isPlainObject(data[ref.as])) {
          data[ref.as] = Model.__private__.shapeReference(
            data[ref.as],
            RelatedModel
          );
        }
      }
    });

    Model.__private__.session.setState(draftState => {
      if (!draftState[Model.name].ids.includes(PK)) {
        draftState[Model.name].ids.push(PK);
      }

      const existingData = draftState[Model.name].byId[PK] || {};

      draftState[Model.name].byId[PK] = mergeWith(
        existingData,
        data,
        mergeFoundIn
      );
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = normalizeRecord;
