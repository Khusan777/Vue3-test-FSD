export const getHalfYearByDate = date => {
  return Math.floor((new Date(date).getMonth() + 6) / 6);
};
