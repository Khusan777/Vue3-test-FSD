import { h } from 'vue';

const PaginationLink = (props, ctx) => {
  return h(
    'button',
    Object.assign({}, ctx.attrs, {
      class: [
        'items-center py-2 relative border text-sm leading-5 font-medium ease-in-out duration-150 transition',
        'focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50',
        'focus:outline-none focus:z-10 cursor-pointer',
        'dark:focus:ring-primary-600',
        props.selected
          ? ['text-white', 'border-primary-600 bg-primary-600', 'dark:border-primary-500 dark:bg-primary-500']
          : [
              'border-gray-300 bg-white active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:active:bg-gray-700',
              'focus:border-primary-300',
              'text-gray-700 active:text-gray-700 hover:text-gray-500 dark:text-white dark:active:text-white dark:hover:text-gray-200',
            ],
      ].concat('class' in ctx.attrs ? ctx.attrs.class : '', 'staticClass' in ctx.attrs ? ctx.data.staticClass : ''),
    }),
    'default' in ctx.slots ? ctx.slots.default() : null
  );
};

PaginationLink.props = {
  selected: { type: Boolean, required: true },
};

export default PaginationLink;
