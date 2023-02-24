import { h, ref, defineComponent } from 'vue';
import AtDropdown from '../../AtDropdown/AtDropdown';
import AtDropdownItem from '../../AtDropdownItem/AtDropdownItem';
import { validateDropdownItems } from '../validations';
import { hasOwnProperty } from '../../../utils';
import { MenuButton } from '@headlessui/vue';

export default defineComponent({
  name: 'SidebarUserDropdown',
  emits: ['logout'],
  props: {
    user: {
      type: Object,
      default: () => {},
      validator: obj => {
        return Object.keys(obj).length ? hasOwnProperty(obj, 'name') && hasOwnProperty(obj, 'phone') : {};
      },
    },
    isMobileOrTablet: { type: Boolean, default: false },
    items: {
      type: Array,
      default: () => [],
      validator: items => {
        return validateDropdownItems(items);
      },
    },
  },
  setup() {
    let isOpen = ref(false);
    let showMenu = ref(false);

    return { isOpen, showMenu };
  },
  render() {
    const formatUserPhone = phoneNumber => {
      const countryCode = phoneNumber.slice(0, 3);
      const operatorCode = phoneNumber.slice(3, 5);
      const phone = `${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8, 10)} ${phoneNumber.slice(10, 12)}`;
      return `+${countryCode} ${operatorCode} ${phone}`;
    };

    const heroIcon = () =>
      h(
        'svg',
        {
          class: ['flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500'],
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 20 20',
          'aria-hidden': 'true',
          fill: 'currentColor',
        },
        [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
            'clip-rule': 'evenodd',
          }),
        ]
      );

    const renderDropdownItems = items => {
      if (!items.length) {
        return h(
          AtDropdownItem,
          {
            icon: { name: 'logout', type: 'outline' },
            onClick: () => {
              this.$emit('logout');
            },
          },
          { default: () => 'Выйти' }
        );
      }
      return items.map(item =>
        h(
          AtDropdownItem,
          {
            icon: item.icon,
            onClick: item.onClick,
          },
          { default: () => item.title }
        )
      );
    };

    return h(
      'div',
      {
        class:
          'mt-2 -mb-2 border-t border-gray-200 dark:border-gray-700 py-5 px-3.5 relative flex flex-col items-stretch text-left w-full',
        as: 'div',
      },

      [
        h(
          AtDropdown,
          { width: 'w-full' },
          {
            button: () =>
              h(
                MenuButton,
                {
                  class: [
                    'group w-full text-sm text-left font-medium text-gray-700',
                    'focus:outline-none dark:bg-gray-800 dark:text-white',
                  ],
                },
                {
                  default: () =>
                    h('span', { class: ['flex w-full justify-between items-center'] }, [
                      h(
                        'span',
                        {
                          class: ['flex min-w-0 items-center justify-between space-x-3'],
                        },
                        [
                          h('img', {
                            class: ['w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 object-cover dark:bg-gray-900'],
                            src:
                              this.user?.avatar_link ??
                              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPReGCHDr3lDMPI3fSycaaL0ecArfpvJtfQ&usqp=CAU',
                            alt: 'User avatar',
                          }),
                          h('span', { class: ['flex-1 min-w-0 text-left'] }, [
                            h(
                              'span',
                              {
                                class: ['text-gray-900 text-sm font-medium truncate block dark:text-white'],
                              },
                              this.user?.name ?? 'Неизвестный'
                            ),
                            h(
                              'span',
                              { class: ['text-gray-500 text-xs truncate dark:text-gray-300'] },
                              this.user?.phone ? formatUserPhone(this.user?.phone) : '–'
                            ),
                          ]),
                        ]
                      ),
                      heroIcon(),
                    ]),
                }
              ),
            default: () => renderDropdownItems(this.items),
          }
        ),
      ]
    );
  },
});
