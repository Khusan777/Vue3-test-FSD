import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'WrapperMenuProxy',
  emits: ['toggled'],
  props: { open: { type: Boolean, default: false } },
  watch: {
    open(value) {
      setTimeout(() => {
        this.$emit('toggled', value);
      }, 25);
    },
  },
  render() {
    return h('div', null, ['default' in this.$slots ? this.$slots.default({ open }) : null]);
  },
});
