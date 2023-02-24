export const getQuarterByDate = date => {
  return Math.floor((new Date(date).getMonth() + 3) / 3);
};
