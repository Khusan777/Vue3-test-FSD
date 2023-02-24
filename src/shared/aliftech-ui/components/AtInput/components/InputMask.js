import * as Mask from './../../../mixins/directives/Mask';
import { computed, h, ref, toRefs, watch, withDirectives } from 'vue';
const { directive: mask, masker, tokens } = Mask;
import { InputEventsTypes } from '../../../constants/InputEvents';
import { setInputEvents } from '../../../mixins/events/InputEvents';

export default {
  name: 'InputMask',
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'].concat(InputEventsTypes),
  props: {
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: '' },
    mask: { type: [String, Array], required: true },
    masked: { type: Boolean, default: false },
    tokens: { type: Object, default: () => tokens },
  },
  setup(props, { emit }) {
    const { modelValue, mask, masked, tokens } = toRefs(props);
    const lastValue = ref(null);
    const display = ref(modelValue.value);

    const config = computed(() => ({
      mask: mask.value,
      tokens: tokens.value,
      masked: masked.value,
    }));

    watch(modelValue, value => {
      if (value !== lastValue.value) {
        display.value = masker(value, mask.value, true, tokens.value);
        lastValue.value = masked.value ? display.value : value;
      }
    });

    const refresh = val => {
      display.value = val;
      const value = masker(val, mask.value, masked.value, tokens.value);
      if (value !== lastValue.value) {
        lastValue.value = value;
        emit('update:modelValue', value);
        return value;
      }
      return undefined;
    };
    watch(masked, () => {
      refresh(display.value);
    });

    const onInput = e => {
      if (e.isTrusted) return;
      if (e instanceof Event) return refresh(e.target.value);
      else return refresh(e);
    };

    return { refresh, display, config, onInput };
  },
  render() {
    return withDirectives(
      h(
        'input',
        Object.assign({}, this.$attrs, setInputEvents(this.$emit), {
          value: this.display,
          type: this.type,
          onChange: () => null,
          onInput: e => {
            e.stopPropagation();
            const result = this.onInput(e);
            if (result) {
              this.$emit('change', result);
            }
          },
        })
      ),
      [[mask, this.config]]
    );
  },
};
