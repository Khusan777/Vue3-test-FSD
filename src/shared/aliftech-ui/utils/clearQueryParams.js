/**
 * Clear route query of unnecessary parameters / Очистка запроса роута от ненужных параметров
 * @param {Object} obj - Parameters query object
 * @returns {Object} - Query object with only existing parameters
 */
export const clearQueryParams = obj => {
  const object = { ...obj };
  let i;
  for (i in object) {
    if (object?.[i] === '' || (typeof object?.[i] === 'object' && !object?.[i]?.length)) {
      delete object?.[i];
    }
  }
  return object;
};
