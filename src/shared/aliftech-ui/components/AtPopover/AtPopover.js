import { h, defineComponent, ref, onMounted, watch, onBeforeUnmount, Transition, Teleport } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

import { useFloating } from '../../hooks/useFloating';
import AtButton from '../AtButton/AtButton';

export default defineComponent({
  name: 'AtPopover',
  props: {
    minWidth: {
      type: Number,
      default: 0,
    },
    maxWidth: {
      type: Number,
      default: null,
    },
    maxHeight: {
      type: Number,
      default: null,
    },
    offset: {
      type: Array,
      default: () => [0, 0],
    },
    placement: {
      type: String,
      default: 'bottom',
      validator: value => value && ['bottom', 'top', 'left', 'right'].includes(value),
    },
    alignment: {
      type: String,
      default: 'center',
      validator: value => value && ['start', 'center', 'end'].includes(value),
    },
    buttonClass: {
      type: String,
      default: '',
    },
    panelClass: {
      type: String,
      default: '',
    },
    teleport: { type: Boolean, default: false },
    teleportToRef: { type: Object, default: null },
    teleportToSelector: { type: String, default: 'body' },
  },
  setup(props) {
    const referenceRef = ref(null);
    const floatingRef = ref(null);
    const { x, y, updatePosition, destroyAutoFloating } = useFloating(referenceRef, floatingRef, {
      autoFloating: true,
      placement: props.placement,
      alignment: props.alignment,
      offset: props.offset,
      exactElement: element => element.value?.$el,
    });

    onMounted(() => {
      updatePosition();
    });

    watch([() => floatingRef.value?.$el, () => referenceRef.value?.$el], updatePosition);

    onBeforeUnmount(() => {
      destroyAutoFloating();
    });

    return {
      referenceRef,
      floatingRef,
      x,
      y,
    };
  },
  render() {
    return h(Popover, popoverProps => {
      return [
        h(PopoverButton, { ref: 'referenceRef', class: this.buttonClass }, () =>
          'button' in this.$slots ? this.$slots.button({ ...this.$props }) : h(AtButton, null, () => 'Open')
        ),
        h(
          Teleport,
          {
            to: this.teleportToRef?.value ? this.teleportToRef.value : this.teleportToSelector,
            disabled: !this.teleport,
          },
          h(
            Transition,
            {
              enterActiveClass: 'transition transition-opacity duration-200',
              enterFromClass: 'opacity-0',
              enterToClass: 'opacity-100',
              leaveActiveClass: 'transition transition-opacity duration-200',
              leaveFromClass: 'opacity-100',
              leaveToClass: 'opacity-0',
            },
            () =>
              h(
                PopoverPanel,
                {
                  ref: 'floatingRef',
                  class: ['absolute top-0 left-0 shadow', this.panelClass],
                  style: {
                    transform: `translate(${this.x}px, ${this.y}px)`,
                    zIndex: 99999,
                  },
                },
                () =>
                  h(
                    'div',
                    {
                      class: 'bg-white dark:bg-gray-700 rounded-md dark:bg-gray-700 focus:outline-none overflow-y-auto',
                      style: {
                        minWidth: this.minWidth ? this.minWidth / 16 + 'rem' : null,
                        maxWidth: this.maxWidth ? this.maxWidth / 16 + 'rem' : null,
                        maxHeight: this.maxHeight ? this.maxHeight / 16 + 'rem' : null,
                      },
                    },
                    [
                      this.$slots.default && h('div', { class: 'p-3 md:p-5' }, this.$slots.default(popoverProps)),
                      this.$slots.footer &&
                        h(
                          'div',
                          { class: 'bg-gray-50 dark:bg-gray-900 p-3 md:p-5 bg-gray-50' },
                          this.$slots.footer(popoverProps)
                        ),
                    ]
                  )
              )
          )
        ),
      ];
    });
  },
});
