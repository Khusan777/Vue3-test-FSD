/**
 * Generate unique id for elements
 * @param {string|number} key
 * @returns {string}
 */
export const generatorId = key => key + Math.floor(Date.now() * Math.random()).toString(16);
