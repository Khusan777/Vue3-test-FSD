/**
 * Returns formatted localized date
 * @param {string} date
 * @returns {string}
 */
export const dateParser = date => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
