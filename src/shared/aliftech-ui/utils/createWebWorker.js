/**
 * @param {Function} func
 * @return {String}
 * */

const createResponse = func =>
  `self.onmessage = event => { const args = event.data; if (args) { (${func}).call(null, self, args) } }`;

/**
 * @param {Function} func
 * @param {Window} window
 * @return {Worker}
 * */

export const createWebWorker = (func, window) => {
  if (typeof window !== 'undefined' && 'Worker' in window && ('URL' in window || 'webkitURL' in window)) {
    const worker = window.Worker || Worker;
    const checkWorker = worker ?? false;
    if (checkWorker !== false) {
      const url = window.URL || window.webkitURL;
      const res = createResponse(func);
      const blob = new Blob([res], { type: 'application/javascript' });
      const link = url.createObjectURL(blob);
      return new Worker(link);
    }
  }
};
