const isPlainObject = require("lodash/isPlainObject");
const isArray = require("lodash/isArray");
const get = require("lodash/get");
const mergeWith = require("lodash/mergeWith");
const set = require("lodash/set");
const setWith = require("lodash/setWith");

const arrayStrategy = (objValue = [], srcValue) => {
  if (isArray(srcValue)) {
    return srcValue;
  }
};

const hasType = (obj, typeKey) => !!get(obj, typeKey, false);

const normalizeByType = (data, typeKey = "type") => {
  const normalized = {};

  const addToNormalized = record => {
    const { [typeKey]: type } = record;

    const normalizedObj = { ...record };

    Object.entries(record).forEach(([key, value]) => {
      if (isArray(value) && hasType(value[0], typeKey)) {
        normalizedObj[key] = value.map(({ id }) => id);
      }
      if (isPlainObject(value) && hasType(value, typeKey)) {
        normalizedObj[key] = value.id;
      }
    });

    const id = get(normalizedObj, "id");
    const byIdPath = `${type}.byId.${id}`;
    const existingRecord = get(normalized, byIdPath, {});

    const mergedObject = mergeWith(
      existingRecord,
      normalizedObj,
      arrayStrategy
    );

    setWith(normalized, byIdPath, mergedObject, Object);

    const allIds = Object.keys(get(normalized, `${type}.byId`, {})).map(id =>
      parseInt(id, 10)
    );

    set(normalized, `${type}.ids`, allIds);

    set(normalized, `${type}.${typeKey}`, type);
  };

  const normalize = obj => {
    if (isArray(obj)) obj.map(o => normalize(o));

    if (isPlainObject(obj)) {
      if (hasType(obj, typeKey)) addToNormalized(obj);

      Object.values(obj).forEach(normalize);
    }
  };

  normalize(data);

  return normalized;
};

module.exports = normalizeByType;
