import months from '../constants/months';

/**
 * Formatting incoming date by the time of the day / Форматирование входящей даты по времени суток
 * @param {string} date - Incoming date
 * @param {string} type - Date type
 * @returns string
 */
export const formatDateByTheTimeOfDay = (date, type = 'short') => {
  const newDate = new Date(date);
  const MM_DateFormat = Number.parseInt(newDate.getMonth(), 10);
  if (type === 'short') {
    return `${newDate.getDate()} ${months['short'][MM_DateFormat]} ${newDate.getFullYear()}`;
  }
  const hours = newDate.getHours();
  let dayPeriod = '';
  if (hours > 4 && hours < 12) {
    dayPeriod = 'утра';
  } else if (hours >= 12 && hours < 16) {
    dayPeriod = 'дня';
  } else if (hours >= 16 && hours < 22) {
    dayPeriod = 'веч.';
  } else {
    dayPeriod = 'ночи';
  }
  return `${hours}:${newDate.getMinutes()} ${dayPeriod} - ${newDate.getDate()} ${
    months['short'][MM_DateFormat]
  } ${newDate.getFullYear()}`;
};
