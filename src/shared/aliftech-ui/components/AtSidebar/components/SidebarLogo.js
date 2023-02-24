import { hasOwnProperty } from '../../../utils';
import { h } from 'vue';
import { RouterLink } from 'vue-router';

const SidebarLogo = props => {
  return props.logo
    ? [
        h(
          RouterLink,
          { to: '/', class: 'block dark:hidden' },
          {
            default: () =>
              h('img', {
                class: ['h-8 w-auto'],
                src: props.logo.path,
                alt: props.logo.name,
              }),
          }
        ),
        h(
          RouterLink,
          { to: '/', class: 'hidden dark:block' },
          {
            default: () =>
              h('img', {
                class: ['h-8 w-auto'],
                src: props.logo.darkPath,
                alt: props.logo.name,
              }),
          }
        ),
      ]
    : h(
        RouterLink,
        { to: '/' },
        {
          default: () =>
            h('img', {
              class: ['h-8 w-auto'],
              src: 'https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg',
              alt: 'Логотип',
            }),
        }
      );
};

SidebarLogo.props = {
  logo: {
    type: Object,
    default: () => {},
    validator: function (obj) {
      return hasOwnProperty(obj, 'name') && (hasOwnProperty(obj, 'path') || hasOwnProperty(obj, 'darkPath'));
    },
  },
};

export default SidebarLogo;
