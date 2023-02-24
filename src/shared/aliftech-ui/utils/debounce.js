/**
 * Returns a function, that, as long as it continues to be invoked, will not
   be triggered. The function will be called after it stops being called for
  `wait` milliseconds.
 * @param {Function} func
 * @param {Number} wait - Delay time
 * @returns {(function(): void)|*}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function () {
    const fnCall = () => {
      func.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, wait);
  };
};
