import { h } from 'vue';
import { getIconComponent } from '../../utils';

const renderIcon = (icon, currentTab) => {
  const { Icon } = getIconComponent(icon);
  return h(Icon, {
    class: [
      '--ml-0.5 mr-2 h-5 w-5',
      currentTab
        ? `text-primary-500 dark:text-primary-400`
        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
    ],
    'aria-hidden': true,
  });
};

const AtTab = (props, context) => {
  return h(
    'a',
    {
      class: [
        'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap',
        props.selected === props.item.value
          ? [`border-primary-500`, `text-primary-600`, `dark:border-primary-400`, `dark:text-primary-400`]
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' +
            ' dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-300',
      ],
      onClick: e => {
        e.preventDefault();
        if (props.selected !== props.item.value) {
          context.emit('select', props.item.value);
        }
      },
    },
    [
      props.item.icon ? renderIcon(props.item.icon, props.selected === props.item.value) : null,
      h('span', ['default' in context.slots ? context.slots.default() : props.item.title]),
    ]
  );
};

AtTab.props = {
  item: {
    type: Object,
    validator: value => value,
    default: () => ({}),
  },
  selected: {
    type: [String, Number, Boolean],
    default: () => undefined,
  },
};

export default AtTab;
