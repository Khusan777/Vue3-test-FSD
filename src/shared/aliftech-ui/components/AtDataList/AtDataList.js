import { h, toRefs, ref, watch, resolveDirective, withDirectives, defineComponent } from 'vue';
import { debounce, deepCopy, transformToBool } from '../../utils';

import AtInput from '../AtInput/AtInput';
import { clickOutside } from '../../mixins/directives/clickOutside';
import InputElements from '../../mixins/props/InputElements';

export default defineComponent({
  name: 'AtDataList',
  emits: ['update:modelValue', 'onSearch'],
  props: {
    ...InputElements.props,
    api: { type: Function, default: () => {} },
    data: { type: Array, default: () => [] },
    modelValue: { type: [String, Number], default: '' },
    valueType: { type: [String, Number], default: 'value' },
    valueToPrint: { type: [String, Number], default: 'title' },
    iconBefore: { type: [String, Object], default: () => '' },
    iconAfter: { type: [String, Object], default: () => '' },
    noDataText: { type: String, default: 'Ничего не найдено' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  directives: { ...clickOutside },
  setup(props, { emit }) {
    let sortedDataObj = ref([]);
    const showDataList = ref(false);
    const clickOutside = resolveDirective('click-outside');
    const data = toRefs(props).data;
    const value = ref('');
    const modelValue = toRefs(props).modelValue;

    setNewValue();

    watch(
      [data, value],
      () => {
        if (value.value.length) {
          sortedDataObj.value = props.data.filter(item => {
            return item[props.valueToPrint].toLowerCase().includes(value.value.toLowerCase());
          });
        } else {
          sortedDataObj.value = deepCopy(props.data);
        }
      },
      { deep: true }
    );

    watch([modelValue], () => {
      if (modelValue.value === '') {
        value.value = '';
      }
    });

    watch(
      [value],
      debounce(() => {
        emit('onSearch', value.value);
      }, 500)
    );

    function setNewValue() {
      showDataList.value = !!value.value.length;
      const newValue = data.value.find(item => String(item[props.valueType]) === String(modelValue.value));
      value.value = newValue ? newValue[props.valueToPrint] : modelValue.value;
      showDataList.value = false;
    }

    function clickOutsideHandler() {
      if (showDataList.value) {
        showDataList.value = false;
        setNewValue();
      }
    }

    function showDataListHandler() {
      showDataList.value = true;
    }

    function setItem(item) {
      value.value = item[props.valueToPrint];
      emit('update:modelValue', item[props.valueType]);
    }

    return { sortedDataObj, showDataList, value, clickOutsideHandler, showDataListHandler, clickOutside, setItem };
  },
  render() {
    return h('div', { class: 'relative border-0 p-0' }, [
      withDirectives(
        h(AtInput, {
          label: this.label,
          type: 'search',
          modelValue: this.value,
          placeholder: this.placeholder,
          disabled: transformToBool(this.disabled),
          error: this.error,
          iconBefore: this.iconBefore,
          iconAfter: this.iconAfter,
          success: this.success,
          'onUpdate:modelValue': value => {
            this.value = value;
            if (value === '') {
              this.$emit('update:modelValue', value);
            }
          },
          onFocus: () => {
            this.showDataListHandler();
          },
        }),
        [[this.clickOutside, this.clickOutsideHandler]]
      ),
      this.showDataList
        ? h(
            'div',
            {
              class:
                'absolute w-full mt-2 py-2 border-2 border-gray-200 rounded-md bg-white max-h-80 overflow-y-auto shadow-lg z-50 dark:bg-gray-700 dark:border-gray-600',
            },
            [
              this.sortedDataObj.length
                ? h('ul', { class: 'divide-y divide-gray-200 dark:divide-gray-600' }, [
                    this.sortedDataObj.map(item =>
                      h(
                        'li',
                        {
                          class: [
                            'block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-white dark:hover:bg-gray-800',
                          ],
                          onClick: () => this.setItem(item),
                        },
                        item[this.valueToPrint]
                      )
                    ),
                  ])
                : h('div', { class: 'block text-center' }, [h('span', { class: 'text-sm' }, this.noDataText)]),
            ]
          )
        : null,
    ]);
  },
});
