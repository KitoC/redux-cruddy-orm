function TEST_ID(id, test) {
  if (test) {
    return { "data-testid": id };
  }
}

const getDataType = dataToCheck => Object.prototype.toString.call(dataToCheck);

const resultObjectShapeWithDataTypes = obj => {
  const object = {};
  Object.keys(obj).forEach(key => {
    object[key] = getDataType(obj[key]);
  });
  return object;
};

export { TEST_ID, getDataType, resultObjectShapeWithDataTypes };
