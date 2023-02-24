import { h } from 'vue';

const AtStatsValue = (props, context) => {
  return 'default' in context.slots
    ? h(
        'dd',
        Object.assign({}, context.attrs, {
          class: ['text-2xl font-semibold text-gray-900 dark:text-white'].concat(
            'class' in context.attrs ? context.attrs.class : ''
          ),
        }),
        context.slots.default()
      )
    : null;
};

export default AtStatsValue;
