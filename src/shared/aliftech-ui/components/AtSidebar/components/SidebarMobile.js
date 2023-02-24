import { h, defineComponent } from 'vue';
import { SidebarItem } from './SidebarItem';
import { props, methods } from '../mixins/sidebarMixins';
import SidebarUserDropdown from './SidebarUserDropdown';
import SidebarLogo from './SidebarLogo';
import { XIcon } from '@heroicons/vue/solid';
import SidebarModules from './SidebarModules';

export default defineComponent({
  name: 'SidebarMobile',
  props: {
    ...props.props,
    isOpen: { type: Boolean, default: false },
  },
  emits: ['closeSidebar', 'update:module'],
  data() {
    return {
      isHiddenSidebar: true,
      isOpenSidebar: false,
    };
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        this.isHiddenSidebar = !this.isOpen;
        setTimeout(() => {
          this.isOpenSidebar = this.isOpen;
        }, 50);
      } else {
        setTimeout(() => {
          this.isHiddenSidebar = !this.isOpen;
        }, 300);
        this.isOpenSidebar = this.isOpen;
      }
    },
  },
  created() {
    this.isOpenSidebar = this.isOpen;
  },
  methods: {
    ...methods.methods,
    closeSidebar() {
      this.$emit('closeSidebar');
    },
  },
  render() {
    const renderSidebarItems = () => {
      return this.items.map(item =>
        h('div', [
          h(SidebarItem, {
            item,
            active: !!this?.checkActiveRoute(item),
          }),
        ])
      );
    };

    const renderCloseButton = () => {
      return this.isOpenSidebar
        ? h(
            'button',
            {
              class: [
                'ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white',
              ],
              onClick: () => this.closeSidebar(),
            },
            [h('span', { class: ['sr-only'] }, 'Close sidebar'), h(XIcon, { class: 'h-4 w-4 text-white' })]
          )
        : null;
    };

    return h(
      'div',
      {
        class: ['fixed inset-0 flex z-40', { hidden: this.isHiddenSidebar }],
      },
      [
        h('div', {
          class: [
            'fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300',
            this.isOpenSidebar ? 'opacity-100' : 'opacity-0',
          ],
          'aria-hidden': 'true',
          onClick: () => this.closeSidebar(),
        }),
        h(
          'div',
          {
            class: [
              'relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition ease-in-out duration-300 transform',
              'dark:bg-gray-800',
              this.isOpenSidebar ? 'translate-x-0' : '-translate-x-full',
            ],
          },
          [
            h(
              'div',
              {
                class: [
                  'absolute top-0 right-0 -mr-12 pt-2 ease-in-out duration-300',
                  this.isOpenSidebar ? 'opacity-100' : 'opacity-0',
                ],
              },
              [renderCloseButton()]
            ),
            h('div', { class: ['px-4 pb-2'] }, [
              'logo' in this.$slots ? this.$slots.logo() : h(SidebarLogo, { logo: this.logo }),
              'modules' in this.$slots
                ? this.$slots.modules()
                : this.modules?.length
                ? h(SidebarModules, {
                    class: 'py-2  ',
                    modules: this.modules,
                    modelValue: this.module,
                    'onUpdate:modelValue': $event => this.$emit('update:module', $event),
                  })
                : null,
            ]),
            h('div', { class: ['flex-1 h-0 overflow-y-auto'] }, [
              h('nav', { class: ['px-2 bg-white space-y-1 dark:bg-gray-800'] }, [renderSidebarItems()]),
              this.noUserSection
                ? null
                : h(
                    SidebarUserDropdown,
                    {
                      user: this.user,
                      items: this.userDropdownItems,
                      onLogout: () => {
                        this.$emit('logout');
                      },
                    },
                    {
                      userDropdownItems: () => {
                        return 'userDropdownItems' in this.$slots ? this.$slots?.userDropdownItems?.() : null;
                      },
                    }
                  ),
            ]),
          ]
        ),
      ]
    );
  },
});
