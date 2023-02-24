import { checkType } from './checkType';
import { hasOwnProperty } from './hasOwnProperty';

/**
 * Compare an array
 * @param {Array} firstArray
 * @param {Array} secondArray
 * @returns {boolean}
 */
const compareArray = (firstArray, secondArray) => {
  if (firstArray.length !== secondArray.length) return false;
  let result = true;

  for (let i = 0; result && i < firstArray.length; i++) {
    result = comparisonValues(firstArray[i], secondArray[i]);
  }
  return result;
};

/**
 * @param {string|Date|Array|Object} firstValue
 * @param {string|Date|Array|Object} secondValue
 * @returns {boolean}
 */
export const comparisonValues = (firstValue, secondValue) => {
  if (firstValue === secondValue) return true;

  /* Checking dates */
  let firstValueType = checkType(firstValue, 'date');
  let secondValueType = checkType(secondValue, 'date');
  if (firstValueType && secondValueType) return firstValue.getTime() === secondValue.getTime();

  /* Checking Arrays */
  firstValueType = checkType(firstValue, 'array');
  secondValueType = checkType(secondValue, 'array');
  if (firstValueType && secondValueType) return compareArray(firstValue, secondValue);

  /* Checking Objects */
  firstValueType = checkType(firstValue, 'object');
  secondValueType = checkType(secondValue, 'object');
  if (firstValueType && secondValueType) {
    if (Object.keys(firstValue).length !== Object.keys(secondValue).length) return false;
    if (Object.is(firstValue, secondValue)) return true;
    for (const key in firstValue) {
      const checkKeyA = hasOwnProperty(firstValue, key, false);
      const checkKeyB = hasOwnProperty(secondValue, key, false);
      if (
        (checkKeyA && !checkKeyB) ||
        (!checkKeyA && checkKeyB) ||
        !comparisonValues(firstValue[key], secondValue[key])
      )
        return false;
    }
  }

  return String(firstValue) === String(secondValue);
};
