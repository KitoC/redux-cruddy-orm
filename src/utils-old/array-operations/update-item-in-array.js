const updateItemInArray = (itemToUpdate, array, key = "id") => {
  const indexOfItem = array.findIndex(item => item[key] === itemToUpdate[key]);
  const newArray = array.concat();

  if (indexOfItem < 0) return newArray;

  newArray[indexOfItem] = {
    ...newArray[indexOfItem],
    ...itemToUpdate
  };

  return newArray;
};

export default updateItemInArray;
