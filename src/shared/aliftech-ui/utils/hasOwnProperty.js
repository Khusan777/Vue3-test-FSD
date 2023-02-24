import { checkType } from './checkType';

export const hasOwnProperty = (obj, key, defaultValue) => {
  if (checkType(key, 'array')) {
    const result = key.reduce((acc, item) => acc?.[item], obj);
    return result !== undefined && result !== null ? result : defaultValue;
  }
  return !(checkType(obj, 'object') && checkType(key, 'string') && Object.prototype.hasOwnProperty.call(obj, key))
    ? defaultValue
    : true;
};
