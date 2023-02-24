import { h } from 'vue';

const AtStatsTitle = (props, context) => {
  return 'default' in context.slots
    ? h(
        'dt',
        Object.assign({}, context.attrs, {
          class: ['text-sm font-medium text-gray-500 truncate dark:text-gray-300'].concat(
            'class' in context.attrs ? context.attrs.class : ''
          ),
        }),
        context.slots.default()
      )
    : null;
};

export default AtStatsTitle;
