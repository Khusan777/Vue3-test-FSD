import { h } from 'vue';

const AtDescriptionGroup = (props, context) => {
  return 'default' in context.slots
    ? h(
        'dl',
        Object.assign({}, context.attrs, {
          class: [
            'at-description-group at-panel-no-padding',
            props.type === 'stripped' ? 'sm:divide-y sm:divide-gray-200' : '',
          ].concat('class' in context.attrs ? context.attrs.class : ''),
        }),
        props.type === 'normal'
          ? context.slots.default().reduce(
              (acc, el, index, arr) => {
                if (
                  Object.prototype.toString.call(el) === '[object Object]' &&
                  'children' in el &&
                  el.children !== undefined
                ) {
                  acc.list.push(
                    h(
                      'dl',
                      {
                        class:
                          (acc.lastIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50') +
                          (arr.length - 1 === index ? ' rounded-br-lg rounded-bl-lg' : ''),
                      },
                      [el]
                    )
                  );
                  acc.lastIndex++;
                }
                return acc;
              },
              { list: [], lastIndex: 0 }
            ).list
          : context.slots.default()
      )
    : null;
};

AtDescriptionGroup.props = { type: { type: String, default: 'normal' } };

export default AtDescriptionGroup;
