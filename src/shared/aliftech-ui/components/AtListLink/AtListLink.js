import { h, resolveComponent } from 'vue';
import './AtListLink.scss';
import RouterLocation from '../../validations/RouterLocation';
import ChevronRightIcon from '@heroicons/vue/solid/ChevronRightIcon';

const AtListLink = (props, context) => {
  const routerLink = resolveComponent('router-link');

  return 'default' in context.slots
    ? h(
        'li',
        Object.assign({}, context.attrs, {
          class: ['at-list-link'].concat('class' in context.attrs ? context.attrs.class : ''),
          style: 'list-style-type: none;',
        }),
        [
          h(
            props.to ? routerLink : props.tag,
            Object.assign(
              {},
              {
                class:
                  'block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out dark:bg-gray-800 dark:focus:bg-gray-900',
              },
              props.to
                ? {
                    to: props.to,
                    replace: props.replace,
                    append: props.append,
                    activeClass: props.activeClass,
                    exact: props.exact,
                    exactActiveClass: props.exactActiveClass,
                    ariaCurrentValue: props.ariaCurrentValue,
                    tag: props.tag,
                  }
                : {}
            ),
            [
              h('div', { class: 'flex items-center px-4 py-4 sm:px-6' }, [
                h('div', { class: 'min-w-0 flex-1 flex items-center pr-4 dark:text-white' }, context.slots.default()),
                h('div', { class: 'text-gray-400' }, [h(ChevronRightIcon, { class: 'w-7' })]),
              ]),
            ]
          ),
        ]
      )
    : null;
};

AtListLink.props = {
  tag: { type: String, default: 'div' },
  to: {
    type: [Object, String],
    validator: to => RouterLocation(to),
    default: '',
  },
  replace: { type: Boolean, default: false },
  append: { type: Boolean, default: false },
  activeClass: { type: String, default: 'router-link-active' },
  exact: { type: Boolean, default: false },
  exactActiveClass: { type: String, default: 'router-link-exact-active' },
  ariaCurrentValue: {
    type: String,
    default: 'page',
    validator: ariaCurrentValue =>
      ariaCurrentValue === 'page' ||
      ariaCurrentValue === 'step' ||
      ariaCurrentValue === 'location' ||
      ariaCurrentValue === 'date' ||
      ariaCurrentValue === 'time',
  },
};

export default AtListLink;
