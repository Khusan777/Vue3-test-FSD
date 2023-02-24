import { defineComponent, h, toRefs } from 'vue';
import RouterLocation from '../../validations/RouterLocation';

import AtTab from '../../components/AtTab/AtTab';
import AtSelect from '../AtSelect/AtSelect';

export default defineComponent({
  name: 'AtTabs',
  props: {
    placeholder: { type: String, default: 'Выберите значение' },
    modelValue: { type: [String, Number], default: '' },
    items: {
      type: Array,
      required: true,
      validator: items => {
        if (!Array.isArray(items)) return false;
        return items.every(item => {
          if (Object.prototype.toString.call(item) === '[object Object]' && 'tag' in item) {
            if (item.tag === 'router-link') {
              if (!('to' in item)) {
                return false;
              } else {
                if (!RouterLocation(item.to)) return false;
              }
            }
          }
          return Object.prototype.toString.call(item) === '[object Object]' && 'title' in item && 'value' in item;
        });
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    let tab = toRefs(props).modelValue;

    return () =>
      h('div', [
        h('div', { class: 'sm:hidden' }, [
          h(AtSelect, {
            options: props.items,
            placeholder: props.placeholder,
            modelValue: tab.value,
            'onUpdate:modelValue': value => {
              emit('update:modelValue', value);
            },
          }),
        ]),
        h('div', { class: 'hidden sm:block overflow-x-auto' }, [
          h('div', { class: 'border-b border-gray-200' }, [
            h('nav', { class: '-mb-px flex space-x-8', 'aria-label': 'Tabs' }, [
              props.items.map(item => {
                if ('item' in slots) {
                  return slots.item({
                    item: item,
                    selected: tab.value,
                    select: value => emit('update:modelValue', value),
                  });
                }
                return h(AtTab, {
                  item: item,
                  selected: tab.value,
                  onSelect: value => emit('update:modelValue', value),
                });
              }),
            ]),
          ]),
        ]),
      ]);
  },
});
