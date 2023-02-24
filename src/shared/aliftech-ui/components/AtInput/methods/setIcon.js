import { h } from 'vue';
import { getIconComponent } from '../../../utils/getIconComponent';

/**
 * Method to set icon before input or after input
 * @param {string|Object} icon
 * @param {string} side
 * @returns {VNode}
 */
export const setIcon = (icon, side = 'left') => {
  const { Icon } = getIconComponent(icon);

  return h(
    'div',
    {
      class: [
        'absolute inset-y-0 flex items-center pointer-events-none z-10',
        side === 'left' ? 'left-0 pl-3' : 'right-0 pr-3',
      ],
    },
    [h(Icon, { class: 'h-5 w-5 text-gray-400 dark:text-white', 'aria-hidden': true })]
  );
};
