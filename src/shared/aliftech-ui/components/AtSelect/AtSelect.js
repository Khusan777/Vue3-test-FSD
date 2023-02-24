import { h, ref, Transition } from 'vue';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { SelectorIcon } from '@heroicons/vue/solid';
import AtInputHelp from '../AtInputHelp/AtInputHelp';
import { getInputHelpType, setInputBorderClass } from '../../utils/componentsSameFunctions/forms';
import InputElements from '../../mixins/props/InputElements';

const AtSelect = (props, ctx) => {
  let selectedItem = ref(props.modelValue);
  const labelContent = 'label' in ctx.slots ? ctx.slot.label : props.label;
  return h('div', [
    h(
      Listbox,
      { as: 'div', modelValue: selectedItem.value, disabled: props.disabled },
      {
        default: () => [
          labelContent
            ? h(
                ListboxLabel,
                { class: 'block text-sm font-medium text-gray-700 leading-6 mb-1 dark:text-white' },
                { default: () => labelContent }
              )
            : null,
          h('div', { class: 'relative' }, [
            'button' in ctx.slots
              ? ctx.slots.button({ disabled: props.disabled, selectedItem: selectedItem.value })
              : h(
                  ListboxButton,
                  {
                    class: [
                      props.beforeInput ? '' : 'border border-gray-300 shadow-sm',
                      'rounded-md cursor-pointer bg-white relative w-full min-w-20 pl-3 pr-10 py-2 text-left  sm:text-sm',
                      setInputBorderClass(props.error, props.success),
                      'transition duration-200',
                      {
                        ['cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700']:
                          !props.disabled,
                      },
                      { 'text-gray-500 dark:text-gray-300': !props.modelValue },
                      { 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed': props.disabled },
                    ],
                  },
                  {
                    default: () => [
                      h('div', { class: 'flex items-center' }, [
                        selectedItem.value?.avatar
                          ? h('img', { src: selectedItem.value?.avatar, class: 'flex-shrink-0 h-6 w-6 rounded-full' })
                          : null,
                        h('span', { class: ['block truncate', selectedItem.value?.avatar ? 'ml-2' : ''] }, [
                          props.valueType
                            ? props.options.find(option => option[props.valueType] === selectedItem.value)?.title ??
                              props.placeholder
                            : selectedItem.value?.title || props.placeholder,
                        ]),
                      ]),

                      h('span', { class: 'absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none' }, [
                        h(SelectorIcon, { class: 'h-5 w-5 text-gray-400', 'aria-hidden': true }),
                      ]),
                    ],
                  }
                ),
            h(
              Transition,
              {
                leaveActiveClass: 'transition ease-in duration-100',
                leaveFromClass: 'opacity-100',
                leaveToClass: 'opacity-0',
              },
              {
                default: () =>
                  h(
                    ListboxOptions,
                    {
                      class: [
                        'absolute z-10 mt-1 w-full min-w-20 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm',
                        'dark:bg-gray-700 dark:ring-gray-600',
                      ],
                    },
                    {
                      default: () =>
                        props.options.map(item =>
                          h(
                            ListboxOption,
                            { as: 'template', value: item.value },
                            {
                              default: () =>
                                h(
                                  'li',
                                  {
                                    class: [
                                      item.value === (props.valueType ? selectedItem.value : selectedItem.value?.value)
                                        ? 'text-white bg-primary-600 dark:bg-primary-500 dark:text-white'
                                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-white dark:hover:bg-gray-800',
                                      'cursor-pointer select-none relative py-2 pl-3 pr-9',
                                    ],
                                    onClick: () => {
                                      ctx.emit('update:modelValue', props.valueType ? item[props.valueType] : item);
                                      ctx.emit('change', props.valueType ? item[props.valueType] : item);
                                    },
                                  },
                                  [
                                    item.value === selectedItem.value?.value
                                      ? h('span', {
                                          class: [
                                            item.value === selectedItem.value.value ? 'text-white' : 'text-primary-600',
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                          ],
                                        })
                                      : '',
                                    h('div', { class: 'flex items-center' }, [
                                      item?.avatar
                                        ? h('img', { src: item?.avatar, class: 'flex-shrink-0 h-6 w-6 rounded-full' })
                                        : '',
                                      h(
                                        'span',
                                        {
                                          class: [
                                            item.value === selectedItem.value?.value ? 'font-semibold' : 'font-normal',
                                            'ml-3 block truncate',
                                          ],
                                        },
                                        [item.title]
                                      ),
                                    ]),
                                  ]
                                ),
                            }
                          )
                        ),
                    }
                  ),
              }
            ),
          ]),
        ],
      }
    ),
    props.error
      ? h(AtInputHelp, { type: getInputHelpType(props.error, props.success) }, { default: () => props.error })
      : null,
  ]);
};

AtSelect.props = {
  ...InputElements.props,
  modelValue: { type: [Object, String, Number], default: () => {} },
  valueType: { type: String, default: 'value' },
  label: { type: String, default: '' },
  beforeInput: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Выберите значение' },
  options: {
    type: Array,
    validator: options =>
      options.every(
        option => Object.prototype.toString.call(option) === '[object Object]' && 'title' in option && 'value' in option
      ),
  },
};

AtSelect.emits = ['change', 'update:modelValue'];

export default AtSelect;
