import { h } from 'vue';

const AtDescriptionElement = (props, context) => {
  return 'default' in context.slots
    ? h(
        'div',
        Object.assign({}, context.attrs, {
          class: ['py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 px-4'].concat(
            'class' in context.attrs ? context.attrs.class : ''
          ),
        }),
        context.slots.default().reduce(
          (acc, node) => {
            const isObj = Object.prototype.toString.call(node) === '[object Object]';
            if (
              (isObj && 'children' in node && node.children && node.children.trim() !== '') ||
              (isObj && 'type' in node && node.type !== undefined)
            ) {
              acc.list.push(
                h(
                  acc.lastIndex === 0 ? 'dt' : 'dd',
                  acc.lastIndex === 1
                    ? { class: 'sm:mt-0 sm:col-span-2' }
                    : acc.lastIndex === 0
                    ? { class: 'font-medium text-gray-500' }
                    : {},
                  [node]
                )
              );
              acc.lastIndex++;
            }

            return acc;
          },
          { list: [], lastIndex: 0 }
        ).list
      )
    : null;
};

export default AtDescriptionElement;
