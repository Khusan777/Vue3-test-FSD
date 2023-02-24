import { h } from 'vue';

const AtModalTitle = (props, ctx) => {
  return h(
    'h3',
    Object.assign({}, ctx.attrs, {
      class: ['text-lg leading-6 font-medium text-gray-900 dark:text-white'].concat(
        'class' in ctx.attrs ? ctx.attrs.class : '',
        'staticClass' in ctx.attrs ? ctx.attrs.staticClass : ''
      ),
    }),
    'default' in ctx.slots ? ctx.slots.default() : null
  );
};

export default AtModalTitle;
