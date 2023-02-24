import { h } from 'vue';

const AtListGroup = (props, context) => {
  return h(
    'div',
    Object.assign({}, context.attrs, {
      class: [
        'bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800 border border-transparent border-gray-300',
      ].concat('class' in context.attrs ? context.attrs.class : ''),
    }),
    [h('ul', 'default' in context.slots ? context.slots.default() : null)]
  );
};

export default AtListGroup;
