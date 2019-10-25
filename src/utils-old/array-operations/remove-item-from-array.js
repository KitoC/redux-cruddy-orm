const removeItemFromArray = (itemToRemove, array, key = "id") => {
  const index = array.findIndex(item => item[key] === itemToRemove[key]);

  if (index < 0) return array;
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export default removeItemFromArray;
