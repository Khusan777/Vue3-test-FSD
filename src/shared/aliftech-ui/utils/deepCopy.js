export const deepCopy = objToCopy => {
  const type = Object.prototype.toString;
  const result =
    type.call(objToCopy) === '[object Array]' ? [] : type.call(objToCopy) === '[object Object]' ? {} : undefined;
  if (result !== undefined) {
    for (const key in objToCopy)
      if (Object.prototype.hasOwnProperty.call(objToCopy, key)) result[key] = deepCopy(objToCopy[key]);
    return result;
  }
  return objToCopy;
};
