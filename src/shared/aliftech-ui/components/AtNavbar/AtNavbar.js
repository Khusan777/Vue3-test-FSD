import { h, defineComponent, Transition } from 'vue';
import { RouterLink } from 'vue-router';
import { hasOwnProperty } from '../../utils';
import { Disclosure, DisclosureButton, Menu, MenuItems, MenuButton, DisclosurePanel } from '@headlessui/vue';
import AtDropdownItem from '../AtDropdownItem/AtDropdownItem';
import { MenuIcon, XIcon } from '@heroicons/vue/outline/index';

export default defineComponent({
  props: {
    navLinks: {
      type: Array,
      default: () => [],
      validator: links => links.every(link => hasOwnProperty(link, 'title') && hasOwnProperty(link, 'to')),
    },
    logo: {
      type: Object,
      default: () => {},
      validator: function (obj) {
        return hasOwnProperty(obj, 'name') && hasOwnProperty(obj, 'path');
      },
    },
    user: {
      type: Object,
      default: () => {},
      validator: obj => {
        return Object.keys(obj).length ? hasOwnProperty(obj, 'name') && hasOwnProperty(obj, 'phone') : {};
      },
    },
    inContainer: { type: Boolean, default: false },
  },
  render() {
    const mobileLinkClass = condition => [
      condition
        ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-gray-700 dark:text-white dark:border-primary-500'
        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
    ];

    const renderUserNavLinks = () => {
      if (hasOwnProperty(this.user, 'links')) {
        if (this.user.links.every(link => hasOwnProperty(link, 'title') && hasOwnProperty(link, 'route'))) {
          return this.user?.links?.map(userLink =>
            h(AtDropdownItem, {
              title: userLink.title,
              icon: userLink.icon || '',
              active: userLink.route.name === this.$route.name,
              'onClick': () => {
                this.$router.push(userLink.route);
              },
            })
          );
        } else {
          throw new Error(
            'User navigation link must contain "title" and "route" parameters, "icon" parameter is secondary'
          );
        }
      } else {
        return [];
      }
    };

    const renderUserNavLinksMobile = () => {
      if (hasOwnProperty(this.user, 'links')) {
        if (this.user.links.every(link => hasOwnProperty(link, 'title') && hasOwnProperty(link, 'route'))) {
          return this.user?.links?.map(userLink =>
            h(
              RouterLink,
              {
                to: userLink.route,
                class: mobileLinkClass(userLink.route.name === this.$route.name),
              },
              { default: () => userLink.title }
            )
          );
        } else {
          throw new Error(
            'User navigation link must contain "title" and "route" parameters, "icon" parameter is secondary'
          );
        }
      } else {
        return [];
      }
    };

    return h(
      Disclosure,
      { as: 'nav', class: ['border-b', 'bg-white border-gray-200', 'dark:bg-gray-800 dark:border-gray-800'] },
      {
        default: ({ open }) => [
          h('div', { class: ['mx-auto px-4', this.inContainer ? 'container' : 'sm:px-6 lg:px-8'] }, [
            h('div', { class: 'flex justify-between h-16' }, [
              h('div', { class: 'flex' }, [
                h('div', { class: 'flex-shrink-0 flex items-center' }, [
                  h(
                    RouterLink,
                    { to: '/', exact: true },
                    {
                      default: () => [
                        h('img', {
                          class: 'h-8 w-auto hidden dark:block',
                          src:
                            this.logo?.path ??
                            'https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg',
                          alt: this.logo?.name ?? 'Nav logo',
                        }),
                        h('img', {
                          class: 'h-8 w-auto block dark:hidden',
                          src:
                            this.logo?.path ??
                            'https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg',
                          alt: this.logo?.name ?? 'Nav logo',
                        }),
                      ],
                    }
                  ),
                ]),
                h('div', { class: 'hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8' }, [
                  this.navLinks.map(link => {
                    return h(
                      RouterLink,
                      {
                        to: link.to,
                        class: [
                          link.to.name === this.$route.name
                            ? 'border-primary-500 text-gray-900 dark:border-primary-500 dark:text-white'
                            : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 border-transparent dark:text-gray-400 dark:hover:border-white dark:hover:text-white dark:border-transparent',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        ],
                        'aria-current': link.to.name === this.$route.name ? 'page' : undefined,
                      },
                      { default: () => link.title }
                    );
                  }),
                ]),
              ]),
              h('div', { class: 'hidden sm:ml-6 sm:flex sm:items-center' }, [
                h(
                  Menu,
                  { as: 'div', class: 'ml-3 relative' },
                  {
                    default: () => [
                      h('div', [
                        h(
                          MenuButton,
                          {
                            class:
                              'max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                          },
                          {
                            default: () =>
                              h('img', {
                                src:
                                  this?.user?.avatar_link ??
                                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPReGCHDr3lDMPI3fSycaaL0ecArfpvJtfQ&usqp=CAU',
                                alt: this.user?.name ?? 'Пользователь',
                                class: 'h-8 w-8 rounded-full',
                              }),
                          }
                        ),
                      ]),
                      h(
                        Transition,
                        {
                          enterActiveClass: 'transition ease-out duration-200',
                          enterFromClass: 'transform opacity-0 scale-95',
                          enterToClass: 'transform opacity-100 scale-100',
                          leaveActiveClass: 'transition ease-in duration-75',
                          leaveFromClass: 'transform opacity-100 scale-100',
                          leaveToClass: 'transform opacity-0 scale-95',
                        },
                        {
                          default: () => [
                            h(
                              MenuItems,
                              {
                                class: [
                                  'origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
                                  'dark:bg-gray-700 dark:ring-gray-700',
                                ],
                              },
                              {
                                default: () => [
                                  h('div', { class: 'block px-4 py-3' }, [
                                    h(
                                      'div',
                                      { class: 'text-base font-medium text-gray-800 dark:text-white' },
                                      this.user?.full_name || `${this.user?.name ?? ''} ${this.user?.surname ?? ''}`
                                    ),
                                    this.user?.phone
                                      ? h(
                                          'div',
                                          { class: 'text-sm font-medium text-gray-500 dark:text-gray-300' },
                                          this.user?.phone
                                        )
                                      : null,
                                  ]),
                                  renderUserNavLinks(),
                                  h(AtDropdownItem, {
                                    title: 'Выйти',
                                    icon: { name: 'logout', type: 'outline' },
                                    onClick: () => this.$emit('logout'),
                                  }),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }
                ),
              ]),
              h('div', { class: '-mr-2 flex items-center sm:hidden' }, [
                h(
                  DisclosureButton,
                  {
                    class: [
                      'inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      'bg-white hover:text-gray-500 hover:bg-gray-100 focus:ring-primary-500',
                      'dark:text-gray-300 dark:bg-gray-800 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800',
                    ],
                  },
                  {
                    default: () =>
                      !open
                        ? h(MenuIcon, { class: 'block h-6 w-6', 'aria-hidden': true })
                        : h(XIcon, { class: 'block h-6 w-6', 'aria-hidden': true }),
                  }
                ),
              ]),
            ]),
          ]),
          h(
            DisclosurePanel,
            { class: 'sm:hidden' },
            {
              default: () => [
                h('div', { class: 'pt-2 pb-3 space-y-1' }, [
                  this.navLinks.map(link =>
                    h(
                      RouterLink,
                      {
                        to: link.to,
                        class: mobileLinkClass(link.to.name === this.$route.name),
                        'aria-current': link.to.name === this.$route.name ? 'page' : undefined,
                      },
                      { default: () => link.title }
                    )
                  ),
                ]),
                h('div', { class: 'pt-4 pb-3 border-t border-gray-200' }, [
                  h('div', { class: 'flex items-center px-4' }, [
                    h('div', { class: 'flex-shrink-0' }, [
                      h('img', {
                        class: 'h-10 w-10 rounded-full',
                        src:
                          this?.user?.avatar_link ??
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPReGCHDr3lDMPI3fSycaaL0ecArfpvJtfQ&usqp=CAU',
                        alt: this.user?.name ?? 'Пользователь',
                      }),
                    ]),
                    h('div', { class: 'ml-3' }, [
                      h(
                        'div',
                        { class: 'text-base font-medium text-gray-800' },
                        this.user?.full_name || `${this.user?.name ?? ''} ${this.user?.surname ?? ''}`
                      ),
                      this.user?.phone
                        ? h('div', { class: 'text-sm font-medium text-gray-500' }, this.user?.phone)
                        : null,
                    ]),
                  ]),
                  h('div', { class: 'mt-3 space-y-1' }, [
                    renderUserNavLinksMobile(),
                    h(
                      'button',
                      {
                        class:
                          'block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100',
                        onClick: () => this.$emit('logout'),
                      },
                      'Выйти'
                    ),
                  ]),
                ]),
              ],
            }
          ),
        ],
      }
    );
  },
});
