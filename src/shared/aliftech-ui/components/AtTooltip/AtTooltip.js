import { defineComponent, h, ref, onMounted, watch, Transition, Teleport } from 'vue';

import { useFloating } from '../../hooks/useFloating';

export default defineComponent({
  name: 'AtTooltip',
  props: {
    body: {
      type: String,
      default: '',
    },
    trigger: {
      type: String,
      default: 'hover',
      validator: trigger => {
        return trigger === 'hover' || trigger === 'click' || trigger === 'focus' || trigger === 'none';
      },
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
    teleport: { type: Boolean, default: false },
    teleportToRef: { type: Object, default: null },
    teleportToSelector: { type: String, default: 'body' },
    duration: { type: Number, default: null },
  },
  setup(props) {
    const show = ref(false);
    const durationTimeout = ref(null);
    const referenceRef = ref(null);
    const floatingRef = ref(null);
    const { x, y, updatePosition } = useFloating(referenceRef, floatingRef, {
      placement: props.placement,
      alignment: props.alignment,
      offset: props.offset,
    });
    onMounted(updatePosition);
    watch([() => floatingRef.value, () => referenceRef.value], updatePosition);

    /**
     * Toggle tooltip visibility
     * @param value
     */
    const toggle = value => {
      show.value = value;

      if (value && props.duration) {
        clearTimeout(durationTimeout.value);

        durationTimeout.value = setTimeout(() => toggle(false), props.duration);
      }
    };

    const triggerEvents = {
      'click': {
        onClick: () => toggle(!show.value),
      },
      'hover': {
        onMouseenter: () => toggle(true),
        onMouseleave: () => toggle(false),
      },
      'focus': {
        onFocus: () => toggle(true),
        onBlur: () => toggle(false),
      },
    };

    return {
      triggerEvents,
      show,
      referenceRef,
      floatingRef,
      x,
      y,
      toggle,
    };
  },
  render() {
    return h('div', { ...this.triggerEvents[this.trigger] }, [
      h('div', { ref: 'referenceRef' }, 'default' in this.$slots ? this.$slots.default({ toggle: this.toggle }) : null),
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
            this.show
              ? h(
                  'div',
                  {
                    ref: 'floatingRef',
                    class: [
                      'bg-gray-900',
                      'dark:bg-gray-600',
                      'text-white',
                      'bg-opacity-80',
                      'rounded-md',
                      'px-6 py-4',
                      'absolute',
                      'z-50',
                      'transition-opacity',
                      'duration-75',
                      'ease-out',
                      'max-w-xs',
                      'top-0',
                      'left-0',
                    ],
                    style: {
                      width: 'max-content',
                      transform: `translate(${this.x}px, ${this.y}px)`,
                    },
                  },
                  ['body' in this.$slots ? this.$slots.body() : this.body]
                )
              : null
        )
      ),
    ]);
  },
});
