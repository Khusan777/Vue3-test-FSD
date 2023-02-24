import { defineComponent, h, Transition } from 'vue';

import { Menu, MenuItems, MenuButton } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/solid';
import { getColor } from '../AtButton/methods/getColor';
import { transformToBool, getIconComponent } from '../../utils';
import { getSize } from '../AtButton/methods/getSize';
import AtLoading from '../AtLoading/AtLoading';
import WrapperMenuProxy from './components/WrapperMenuProxy';

export default defineComponent({
  name: 'AtDropdown',
  props: {
    title: { type: String, default: 'Выберите значение' },
    color: { type: String, default: '' },
    size: { type: String, default: 'md' },
    loading: { type: Boolean, default: false },
    withDividers: { type: Boolean, default: false },
    icon: { type: [String, Object], default: () => '' },
    iconButton: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    position: { type: String, default: undefined },
  },
  data() {
    return {
      top: 0,
      left: 0,
      retrievedPosition: undefined,
      timeoutAnimation: undefined,
      timeoutId: undefined,
      menuItemsHeight: 0,
      menuItemsWidth: undefined,
    };
  },
  methods: {
    /**
     * Toggle visibility of dropdown menu
     * @param {boolean} value
     * @returns {void}
     */
    toggle(value) {
      if (value) {
        this.getPosition();
      } else {
        this.menuItemsHeight = 0;
      }
    },

    /**
     * Метод получения позици выпадающего списка
     * @return {VoidFunction}
     * */
    getPosition() {
      if (
        this.$refs.wrapperMenuProxy &&
        Object.prototype.toString.call(this.$refs.wrapperMenuProxy === '[object Object]') &&
        '$el' in this.$refs.wrapperMenuProxy
      ) {
        const wrapperMenuProxy = this.$refs.wrapperMenuProxy.$el;
        if (wrapperMenuProxy && 'getBoundingClientRect' in wrapperMenuProxy) {
          this.top = wrapperMenuProxy.clientHeight + 8;
          this.retrievedPosition = this.position || 'left';
          if (
            this.$refs.wrapperMenuItems &&
            Object.prototype.toString.call(this.$refs.wrapperMenuItems === '[object Object]')
          ) {
            const wrapperMenuItems = this.$refs.wrapperMenuItems.$el;
            const { scrollHeight: itemsHeight, scrollWidth: itemsWidth } = wrapperMenuItems;

            if (this.timeoutId) {
              clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
              if (this.top + itemsHeight + wrapperMenuProxy.getBoundingClientRect().top > window.innerHeight) {
                this.top -= 16 + wrapperMenuProxy.clientHeight + itemsHeight;
              }

              if (this.left + itemsWidth > window.innerWidth - wrapperMenuProxy.getBoundingClientRect().x) {
                this.left += wrapperMenuProxy.clientWidth;
                this.left -= itemsWidth;
                this.retrievedPosition = 'right';
              }

              this.menuItemsHeight = itemsHeight;
              this.menuItemsWidth =
                itemsWidth < wrapperMenuProxy.clientWidth ? wrapperMenuProxy.clientWidth : itemsWidth;
            }, 15);
          }
        }
      }
    },
  },
  render() {
    return h(
      Menu,
      { as: 'div', class: 'relative inline-block text-left' },
      {
        default: ({ open }) => {
          return [
            h(
              WrapperMenuProxy,
              {
                open,
                ref: 'wrapperMenuProxy',
                onToggled: value => {
                  this.toggle(value);
                },
              },
              {
                default: () => [
                  h(
                    MenuButton,
                    {
                      as: 'div',
                      class: 'cursor-pointer select-none',
                    },
                    () => [
                      'button' in this.$slots
                        ? this.$slots.button({ ...this.$props })
                        : h(
                            'div',
                            {
                              class: [
                                { 'pointer-events-none': this.loading },
                                getColor(this.color, this.loading, transformToBool(this.disabled)),
                                getSize(this.size, this.iconButton),
                                'inline-flex items-center border font-medium rounded-md focus:outline-none transition ease-in-out duration-150',
                                { 'rounded-full': this.iconButton },
                              ],
                            },
                            [
                              this.loading
                                ? h(AtLoading, {
                                    class: 'mr-3',
                                    color: this.color,
                                    size: this.size,
                                  })
                                : null,
                              this.icon
                                ? h(
                                    'span',
                                    {
                                      class: [
                                        'inline-block align-middle',
                                        this.iconButton
                                          ? {}
                                          : {
                                              'mr-1': this.size === 'xs' || this.size === 'sm',
                                              'mr-2': this.size !== 'xs' && this.size !== 'sm',
                                            },
                                      ],
                                    },
                                    [
                                      h(getIconComponent(this.icon).Icon, {
                                        class: [
                                          this.size === 'xs'
                                            ? 'h-3.5'
                                            : this.size === 'md' || this.size === 'lg'
                                            ? 'h-5'
                                            : 'h-4',
                                        ],
                                      }),
                                    ]
                                  )
                                : null,
                              this.iconButton ? null : this.title,
                              this.iconButton
                                ? null
                                : h(ChevronDownIcon, { class: '-mr-1 ml-2 h-5 w-5', 'aria-hidden': true }),
                            ]
                          ),
                    ]
                  ),
                ],
              }
            ),

            h(
              Transition,
              {
                enterActiveClass: 'transition ease-out duration-100',
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
                      as: 'div',
                      class: [
                        'absolute transition-opacity transition-transform duration-75 ease-out w-56 outline-0',
                        this.retrievedPosition + '-0',
                      ],
                      style: {
                        height: this.menuItemsHeight / 16 + 'rem',
                        width: this.menuItemsWidth ? this.menuItemsWidth / 16 + 'rem' : null,
                        overflow: open && this.menuItemsHeight ? 'visible' : 'hidden',
                        left: this.left / 16 + 'rem',
                        top: this.top / 16 + 'rem',
                        opacity: open && this.menuItemsHeight ? 1 : 0,
                        transform: open && this.menuItemsHeight ? 'scale(1)' : 'scale(0.95)',
                        zIndex: 99999,
                      },
                      ref: 'wrapperMenuItems',
                    },
                    {
                      default: () => [
                        'items' in this.$slots
                          ? this.$slots.items()
                          : h(
                              'div',
                              {
                                class: [
                                  `origin-top-right max-h-48 overflow-y-auto w-full rounded-md`,
                                  'shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none',
                                ],
                                onScroll: e => {
                                  if (e.target.scrollTop === e.target.scrollHeight - e.target.offsetHeight) {
                                    this.$emit('onScrolledToBottom');
                                  }
                                },
                              },
                              {
                                default: () => [
                                  h(
                                    'div',
                                    {
                                      class: [
                                        'py-1',
                                        { 'divide-y divide-gray-100 dark:divide-gray-600': this.withDividers },
                                      ],
                                    },
                                    [
                                      'header' in this.$slots
                                        ? h('div', { class: 'block px-4 py-2' }, this.$slots.header?.())
                                        : null,
                                      this.$slots.default?.(),
                                    ]
                                  ),
                                ],
                              }
                            ),
                      ],
                    }
                  ),
                ],
              }
            ),
          ];
        },
      }
    );
  },
});
