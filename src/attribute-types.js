const { relationTypes, attributeTypes } = require("./constants");

const PK = () => ({ type: attributeTypes.PK });

const Attr = () => ({ type: attributeTypes.ATTR });

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

module.exports = { PK, Attr, hasOne, hasMany };
