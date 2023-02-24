import { InputEventsTypes } from '../../constants/InputEvents';
/**
 * Set default events for input
 * @param {Function} emit
 * @param {Attr[]} attrs
 * @returns {Object}
 */
export const setInputEvents = (emit, attrs) => {
  const events = {};
  for (const event of InputEventsTypes) {
    const eventName = `on${event.toString().substr(0, 1).toUpperCase()}${event.toString().substr(1)}`;
    if (attrs && eventName in attrs) {
      events[eventName] = (...args) => {
        return emit(event, ...args);
      };
    }
  }
  return events;
};
