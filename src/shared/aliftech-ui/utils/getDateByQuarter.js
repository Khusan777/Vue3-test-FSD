/**
 *
 * @param {string|number} year
 * @param {string|number} quarter
 */
export const getDateByQuarter = (quarter, year = new Date().getFullYear()) => {
  if (!quarter) return null;
  const month = (quarter - 1) * 3;
  return { single: new Date(year, month, 1), range: [new Date(year, month, 1), new Date(year, month + 3, 0)] };
};
