import { h, defineComponent } from 'vue';
import { SidebarItem } from './SidebarItem';
import SidebarUserDropdown from './SidebarUserDropdown';
import { props, methods } from '../mixins/sidebarMixins';
import SidebarLogo from './SidebarLogo';
import SidebarModules from './SidebarModules';

export default defineComponent({
  name: 'AtSidebarDesktop',
  emits: ['logout', 'update:module'],
  props: {
    logout: { type: Function, default: () => {} },
    ...props.props,
  },
  methods: {
    ...methods.methods,
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

    return h('div', { class: ['flex flex-shrink-0'] }, [
      h(
        'div',
        {
          class: [
            'flex flex-col w-64 border-r border-gray-200 pt-5 bg-white',
            'dark:border-gray-700 dark:bg-gray-800',
            { 'pb-4': this.noUserSection },
          ],
        },
        [
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
          h('div', { class: ['h-0 flex-1 flex flex-col overflow-y-auto pb-2'] }, [
            h('div', { class: ['flex-1 h-0 overflow-y-auto'] }, [
              h('nav', { class: ['flex-1 px-2 bg-white space-y-1 dark:bg-gray-800'] }, [renderSidebarItems()]),
            ]),
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
    ]);
  },
});
