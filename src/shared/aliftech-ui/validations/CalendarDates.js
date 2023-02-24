import { checkType } from '../utils';

const checkIsValidDate = date => {
  if (checkType(date, 'date')) {
    return true;
  }
  if (checkType(date, 'string')) {
    const dateString = date.split('-');
    if (dateString.length === 3) {
      const year = parseInt(dateString[0], 10);
      const month = parseInt(dateString[1], 10);
      const day = parseInt(dateString[2], 10);
      if (year && month && day) {
        if ('Invalid Date' !== new Date(year, month, day).toString()) {
          return true;
        }
      }
    }
  }
  return false;
};

export default dates => {
  if (!dates) return true;
  if (checkType(dates, 'array')) {
    return dates.every(date => checkIsValidDate(date));
  }
  if (dates && checkType(dates, 'object')) {
    return 'to' in dates && checkIsValidDate(dates.to) && 'from' in dates && checkIsValidDate(dates.from);
  }
  return false;
};
