import { h } from 'vue';
import { transformToBool } from '../../utils';
import LinkMixin from '../../mixins/props/Link';

import { RouterLink } from 'vue-router';

const AtTableItem = (props, context) => {
  const renderElement = () => {
    const node = 'default' in context.slots ? context.slots.default() : null;
    return transformToBool(props.arrow)
      ? [
          h('div', { class: 'flex items-center' }, [
            h('div', { class: 'min-w-0 flex-1 flex items-center pr-4' }, [node]),
            h('div', { class: 'text-gray-400 dark:text-gray-200' }, [
              h('fe-chevron-right-icon', { props: { size: '20' } }),
            ]),
          ]),
        ]
      : node;
  };

  return props.to
    ? h('td', null, [
        h(
          RouterLink,
          {
            class: ['at-table__body-element', 'block whitespace-no-wrap'].concat(
              'class' in context.attrs ? context.attrs.class : ''
            ),
            to: props.to,
            replace: props.replace,
            append: props.append,
            activeClass: props.activeClass,
            exact: props.exact,
            exactActiveClass: props.exactActiveClass,
            ariaCurrentValue: props.ariaCurrentValue,
          },
          {
            default: () => renderElement(),
          }
        ),
      ])
    : h(
        'td',
        Object.assign({}, context.attrs, {
          class: ['at-table__body-element', 'whitespace-no-wrap'].concat(
            'class' in context.attrs ? context.attrs.class : ''
          ),
        }),
        [renderElement()]
      );
};

AtTableItem.props = {
  ...LinkMixin.props,
  tag: { type: String, default: 'a' },
  arrow: { type: [Boolean, String, Number], default: false },
  size: { type: String, default: 'lg', validator: value => value && ['sm', 'md', 'lg'].includes(value) },
};

export default AtTableItem;
