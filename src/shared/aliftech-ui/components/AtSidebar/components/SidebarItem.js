import { h, defineComponent, ref } from 'vue';
import SidebarItemLink from './SidebarItemLink';
import { sidebarItemProps } from '../mixins/sidebarMixins';

export const SidebarItem = defineComponent({
  name: 'AtSidebarItem',
  props: { ...sidebarItemProps.props },
  setup() {
    const isCollapseItem = ref(false);

    function toggleItemCollapse() {
      isCollapseItem.value = !isCollapseItem.value;
    }

    return {
      isCollapseItem,
      toggleItemCollapse,
    };
  },
  render() {
    return h(SidebarItemLink, {
      item: this.item,
      collapsed: this.isCollapseItem,
      active: this.active,
      routeName: this?.$route?.name ?? '',
      onClick: () => {
        this.toggleItemCollapse();
      },
    });
  },
});
