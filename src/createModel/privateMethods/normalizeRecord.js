const { createPK } = require("../../utils/createModel");
const { relationTypes } = require("../../constants");
const isArray = require("lodash/isArray");
const mergeWith = require("lodash/mergeWith");

const mergeFoundIn = (objValue = [], srcValue) => {
  if (isArray(srcValue)) {
    return srcValue;
  }
};

const normalizeRecord = (model, models) => record => {
  try {
    let data = { ...record };

    const { value: PK } = createPK(record, model.PK);

    const keys = Object.keys(data);

    model.references
      .filter(ref => keys.includes(ref.as) && relationTypes[ref.relationType])
      .forEach(ref => {
        const relatedData = data[ref.as];
        const relatedModel = models[ref.model];

        if (!relatedModel) {
          throw new Error(
            `You are attempting to use a related model that thas not been defined yet - check "${ref.model}" on "${model.name}"`
          );
        }

        relatedModel.upsert(
          relatedData,
          model.__private__.createParent({ ref, data })
        );

        if (isArray(data[ref.as])) {
          data[ref.as] = data[ref.as].map(relatedRecord =>
            model.__private__.shapeReference(relatedRecord, relatedModel)
          );
        } else {
          data[ref.as] = model.__private__.shapeReference(
            data[ref.as],
            relatedModel
          );
        }
      });

    model.__private__.session.setState(draftState => {
      if (!draftState[model.name].ids.includes(PK)) {
        draftState[model.name].ids.push(PK);
      }

      const existingData = draftState[model.name].byId[PK] || {};

      draftState[model.name].byId[PK] = mergeWith(
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
