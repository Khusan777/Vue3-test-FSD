import { h } from 'vue';

const AtPanelSubTitle = (props, ctx) => {
  return 'default' in ctx.slots
    ? h(
        'p',
        Object.assign({}, ctx.attrs, {
          class: ['mt-1 text-sm leading-5 text-gray-500 dark:text-gray-300'].concat(
            'class' in ctx.attrs ? ctx.attrs.class : ''
          ),
        }),
        ctx.slots.default()
      )
    : null;
};

export default AtPanelSubTitle;
