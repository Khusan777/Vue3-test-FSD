import { hasOwnProperty, checkType } from '../../../utils';

export const validateItem = item =>
  !item.to
    ? hasOwnProperty(item, 'routes') &&
      item.routes.length &&
      hasOwnProperty(item, 'title') &&
      typeof item.title === 'string'
    : hasOwnProperty(item, 'to') &&
      typeof item.to === 'object' &&
      hasOwnProperty(item, 'title') &&
      typeof item.title === 'string';

export const validateDropdownItems = userDropdownItems => {
  if (!checkType(userDropdownItems, 'array')) {
    return false;
  }
  return userDropdownItems.every(userDropdownItem => {
    if (!checkType(userDropdownItem, 'object')) {
      return false;
    }
    if (!(hasOwnProperty(userDropdownItem, 'title') && checkType(userDropdownItem.title, 'string'))) {
      return false;
    }
    if (!(hasOwnProperty(userDropdownItem, 'onClick') && checkType(userDropdownItem.onClick, 'function'))) {
      return false;
    }
    if (hasOwnProperty(userDropdownItem, 'icon')) {
      if (!checkType(userDropdownItem.icon, 'object') && !checkType(userDropdownItem.icon, 'string')) {
        return false;
      }
      if (checkType(userDropdownItem.icon, 'object')) {
        if (!(hasOwnProperty(userDropdownItem.icon, 'name') && checkType(userDropdownItem.icon.name, 'string'))) {
          return false;
        }
        if (!(hasOwnProperty(userDropdownItem.icon, 'type') && checkType(userDropdownItem.icon.type, 'string'))) {
          return false;
        }
      }
    }
    return true;
  });
};

export const validateModules = modules => {
  if (!checkType(modules, 'array')) {
    return false;
  }
  return modules.every(
    module => Object.prototype.toString.call(module) === '[object Object]' && 'title' in module && 'value' in module
  );
};
