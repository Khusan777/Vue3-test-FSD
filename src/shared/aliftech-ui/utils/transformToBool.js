import { checkType } from './checkType';

export const transformToBool = val => {
  if (checkType(val, 'string')) {
    return val === 'true';
  }
  if (checkType(val, 'number')) {
    return !!val;
  }
  if (checkType(val, 'boolean')) {
    return val;
  }
  return false;
};
