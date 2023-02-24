import { h } from 'vue';

const TITLE_SIZES = {
  sm: 'text-base',
  md: 'text-base',
  lg: 'text-lg leading-6 font-medium',
};

const AtPanelTitle = (props, ctx) => {
  const sizeClasses = TITLE_SIZES[props.size];
  return 'default' in ctx.slots
    ? h(
        props.tag,
        Object.assign({}, ctx.attrs, {
          class: ['text-gray-900 dark:text-white'].concat('class' in ctx.attrs ? ctx.attrs.class : '', sizeClasses),
        }),
        [ctx.slots.default()]
      )
    : null;
};

AtPanelTitle.props = {
  tag: { type: String, default: 'h2' },
  size: { type: String, default: 'lg', validator: value => value && ['sm', 'md', 'lg'].includes(value) },
};

export default AtPanelTitle;
