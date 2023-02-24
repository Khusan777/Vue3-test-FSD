module.exports = function (prop) {
  const toString = Object.prototype.toString;
  if (toString.call(prop) !== '[object String]' && toString.call(prop) !== '[object Object]') return false;
  if (toString.call(prop) === '[object Object]') {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    let check = false;
    for (const key in prop) {
      if (hasOwnProperty.call(prop, key)) {
        check = true;
        break;
      }
    }
    if (!check) return false;
    const inObj = (prop, key, type) =>
      hasOwnProperty.call(prop, key) && toString.call(prop[key]) !== '[object ' + type + ']';
    // Если есть свойство name и не тип String
    if (inObj(prop, 'name', 'String')) return false;
    // Если есть свойство path и не тип String
    if (inObj(prop, 'path', 'String')) return false;
    // Если есть свойство hash и не тип String
    if (inObj(prop, 'hash', 'String')) return false;
    // Проверка свойства query
    if (hasOwnProperty.call(prop, 'query')) {
      const query = prop.query;
      if (query && toString.call(query) === '[object Object]') {
        let check = true;
        for (const key in query) {
          if (hasOwnProperty.call(query, key)) {
            const value = query[key];
            const checkInArray = Array.isArray(value)
              ? value.every(val => val === null || toString.call(val) === '[object String]')
              : true;
            if (toString.call(value) !== '[object String]' && !checkInArray && value !== null && value !== undefined) {
              check = false;
              break;
            }
          }
        }
        if (!check) return false;
      } else return false;
    }
    // Проверка свойства params
    if (hasOwnProperty.call(prop, 'params')) {
      if (prop.params && toString.call(prop.params) !== '[object Object]') {
        return false;
      }
    }
    // Если есть свойство append и не тип Boolean
    if (inObj(prop, 'append', 'Boolean')) return false;
    // Если есть свойство replace и не тип Boolean
    if (inObj(prop, 'replace', 'Boolean')) return false;
  }
  return true;
};
