import { nextTick } from 'vue';

export const clickOutside = {
  'click-outside': {
    beforeMount: (el, binding) => {
      el.clickOutsideEvent = event => {
        nextTick(() => {
          if (el !== undefined) {
            const path = event?.path || (event?.composedPath ? event?.composedPath() : undefined);
            if (path ? path.indexOf(el) < 0 : !el.contains(event.target)) {
              binding.value(event);
            }
          }
        });
      };
      document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted: el => {
      document.removeEventListener('click', el.clickOutsideEvent);
    },
  },
};
