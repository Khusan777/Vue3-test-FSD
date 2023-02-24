import { h } from 'vue';

const AtInputAddOn = (props, { slots }) => {
  const childType = 'default' in slots ? slots.default?.()?.[0]?.type?.name : '';

  return h(
    'div',
    {
      class: [
        { 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700': childType !== 'AtButton' },
        'inline-flex items-center sm:text-sm',
        props.side === 'left' ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0',
        { 'px-3': childType !== 'AtButton' && !props.select },
      ],
    },
    slots.default()
  );
};

AtInputAddOn.props = {
  select: { type: Boolean, default: false },
  side: { type: String, default: 'left', validator: value => value === 'left' || value === 'right' },
};

export default AtInputAddOn;
