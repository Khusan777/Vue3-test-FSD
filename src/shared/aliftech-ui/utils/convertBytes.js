/**
 * @param {number} bytes
 * @returns {{terabyte: number, bytes, megabyte: number, kilobyte: number, gigabyte: number, key: string}}
 */
export const convertBytes = bytes => {
  let max = Number.MAX_SAFE_INTEGER;
  let key = '';
  const setMax = (int, type) => {
    const result = int / 1000;
    if (result < max && result >= 1) {
      max = result;
      key = type;
    }
    return result;
  };
  const kilobyte = setMax(bytes, 'kilobyte');
  const megabyte = setMax(kilobyte, 'megabyte');
  const gigabyte = setMax(megabyte, 'gigabyte');
  const terabyte = setMax(gigabyte, 'terabyte');
  return {
    bytes,
    kilobyte,
    megabyte,
    gigabyte,
    terabyte,
    key,
  };
};
