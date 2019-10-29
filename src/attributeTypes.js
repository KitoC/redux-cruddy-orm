const { relationTypes, attributeTypes } = require("./constants");

const primaryKey = () => ({ type: attributeTypes.PK });

const attribute = () => ({ type: attributeTypes.ATTR });

const referenceShared = options => {
  const { model, as = model, FK = "id", cascade = false } = options;

  return { model, as, reference: true, FK, cascade };
};

const hasOne = ref => ({
  relationType: relationTypes.hasOne,
  ...referenceShared(ref)
});

const hasMany = ref => ({
  relationType: relationTypes.hasMany,
  ...referenceShared(ref)
});

module.exports = { primaryKey, attribute, hasOne, hasMany };
