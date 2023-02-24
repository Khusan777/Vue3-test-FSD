import { h } from 'vue';

const AtTableHeadItem = (props, context) => {
  const classes = [
    'at-table__head-element',
    'bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider',
    'dark:bg-gray-900 dark:text-white',
  ];
  return h(
    'th',
    {
      class: classes,
    },
    'default' in context.slots ? context.slots.default() : null
  );
};

export default AtTableHeadItem;
