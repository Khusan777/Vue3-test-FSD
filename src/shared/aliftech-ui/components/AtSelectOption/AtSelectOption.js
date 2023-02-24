import { h } from 'vue';
import { transformToBool } from '../../utils';

const AtSelectOption = (props, ctx) => {
  const slotProps = {
    selected: transformToBool(props.selected),
    disabled: transformToBool(props.disabled),
  };
  let slot = 'default' in ctx.slots ? ctx.slots.default(slotProps) : null;
  if (
    Array.isArray(slot) &&
    !slot.every(slot => Object.prototype.toString.call(slot) === '[object Object]' && 'tag' in slot && slot.tag)
  ) {
    slot = h(
      'span',
      {
        class: ['truncate', { 'font-semibold': slotProps.selected, 'font-normal': !slotProps.selected }],
      },
      slot
    );
  }
  return h(
    props.tag ? props.tag : 'li',
    Object.assign({}, ctx.attrs, {
      class: [].concat(
        'class' in ctx.attrs ? ctx.attrs.class : '',
        'staticClass' in ctx.attrs ? ctx.attrs.staticClass : '',
        [
          'text-gray-900 hover:bg-gray-100 select-none relative py-2 px-3',
          {
            'cursor-pointer': !slotProps.disabled && !slotProps.selected,
            'bg-gray-100': !slotProps.disabled && slotProps.selected,
            'bg-gray-200': slotProps.disabled,
          },
        ]
      ),
    }),
    [slot]
  );
};

AtSelectOption.props = {
  tag: { type: String, default: 'li' },
  selected: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};

export default AtSelectOption;
