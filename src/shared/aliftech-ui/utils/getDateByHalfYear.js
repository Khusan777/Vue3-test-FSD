/**
 *
 * @param {string|number} year
 * @param {string|number} quarter
 */
export const getDateByHalfYear = (halfYear, year = new Date().getFullYear()) => {
  if (!halfYear) return null;
  const month = halfYear * 6 - 6;
  return { single: new Date(year, month, 1), range: [new Date(year, month, 1), new Date(year, month + 6, 0)] };
};
