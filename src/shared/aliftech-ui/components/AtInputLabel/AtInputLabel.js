import { h } from 'vue';
import { transformToBool } from '../../utils';

const AtInputLabel = (props, ctx) => {
  let slotParams = {
    title: props.title,
    corner: null,
    error: transformToBool(props.error),
    success: transformToBool(props.success),
  };
  const corner =
    'corner' in ctx.slots
      ? h('span', { class: 'text-sm leading-5 text-gray-500 dark:text-gray-300' }, ctx.slots.corner(slotParams))
      : null;
  slotParams = Object.assign(
    {},
    slotParams,
    'corner' in ctx.slots
      ? {
          corner: {
            name: 'AtInputLabelCorner',
            render() {
              return corner;
            },
          },
        }
      : {}
  );
  if ('label' in ctx.slots) {
    return ctx.slots.label(slotParams);
  }
  const titleElement = h(
    'span',
    {
      class: [
        'text-sm font-medium leading-5 text-gray-700 dark:text-white',
        {
          'text-red-600 dark:text-red-500': slotParams.error,
          'text-green-600 dark:text-green-500': slotParams.success,
        },
      ],
    },
    'default' in ctx.slots ? ctx.slots.default(slotParams) : props.title
  );
  return 'default' in ctx.slots || props.title
    ? h(
        'span',
        Object.assign({}, ctx.attrs, {
          class: ['mb-1', { 'flex justify-between': corner }].concat(
            'class' in ctx.attrs ? ctx.attrs.class : '',
            'staticClass' in ctx.attrs ? ctx.attrs.staticClass : ''
          ),
        }),
        [corner ? [titleElement, corner] : titleElement]
      )
    : null;
};

AtInputLabel.props = {
  title: { type: String, default: '' },
  error: { type: [Boolean, String, Number], default: false },
  success: { default: false },
};

export default AtInputLabel;
