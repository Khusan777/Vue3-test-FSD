// @ts-ignore
import { InputEventsTypes } from '../../constants/InputEvents.js';
import { SetupContext } from 'vue';

type TEvents = Record<string, SetupContext['emit']>;

// Set default events for input
export const setInputEvents = (emit: SetupContext['emit'], attrs: SetupContext['attrs']): TEvents => {
  const events: TEvents = {};
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
