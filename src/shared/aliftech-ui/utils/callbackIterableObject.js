import { checkType } from './checkType';
import { hasOwnProperty } from './hasOwnProperty';

export const callbackIterableObject = (obj, callback) => {
  const result = [];
  for (const key in obj) {
    if (hasOwnProperty(obj, key)) {
      result.push([key, obj[key]]);
      if (checkType(callback, 'function')) {
        callback(obj[key], key);
      }
    }
  }
  return result;
};
