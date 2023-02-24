import { h } from 'vue';

import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

import { generatorId } from '../../utils';

const AtRadioTableGroup = (props, { emit, slots }) => {
  return h(
    RadioGroup,
    {
      modelValue: props.modelValue,
      'onUpdate:modelValue': value => emit('update:modelValue', value),
    },
    {
      default: () => [
        h('div', { class: 'relative bg-white rounded-md -space-y-px dark:bg-gray-800' }, [
          props.items.map((item, itemIdx) => {
            return h(
              RadioGroupOption,
              {
                as: 'template',
                value: item[props.valueType],
              },
              {
                default: ({ checked, active }) => {
                  return h(
                    'div',
                    {
                      class: [
                        itemIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                        itemIdx === props.items.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                        checked
                          ? 'bg-primary-50 border-primary-200 z-10 dark:bg-gray-900 dark:border-gray-700 z-10'
                          : 'border-gray-200 dark:border-gray-700',
                        'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-' +
                          props.cols +
                          ' focus:outline-none',
                        {
                          'border-red-300 dark:border-red-500 form-radio--error': props.error,
                          'border-green-500 dark:border-red-300 form-radio--success': props.success,
                        },
                      ],
                    },
                    [
                      h('div', { class: 'flex items-center text-sm' }, [
                        h(
                          'span',
                          {
                            class: [
                              checked ? 'bg-primary-600 border-transparent' : 'bg-white border-gray-300',
                              active ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-900' : '',
                              'h-4 w-4 rounded-full border flex items-center justify-center',
                            ],
                            'aria-hidden': true,
                          },
                          [
                            h('span', {
                              class: 'rounded-full bg-white w-1.5 h-1.5',
                            }),
                          ]
                        ),
                        h(
                          RadioGroupLabel,
                          {
                            as: 'span',
                            class: [
                              checked ? 'text-primary-900 dark:text-white' : 'text-gray-900 dark:text-white',
                              'ml-3 font-medium',
                            ],
                          },
                          { default: () => item.title }
                        ),
                      ]),
                      'columns' in slots
                        ? slots.columns({ columns: item.columns })
                        : item.columns.length
                        ? item.columns.map((col, colIdx) => {
                            return h(
                              RadioGroupDescription,
                              {
                                class: [
                                  'ml-6 pl-1 text-sm md:ml-0 md:pl-0',
                                  colIdx === item.columns.length - 1 ? 'md:text-right' : 'md:text-center',
                                  checked ? 'text-primary-900 dark:text-white' : 'dark:text-gray-200',
                                ],
                              },
                              { default: () => col.text }
                            );
                          })
                        : null,
                    ]
                  );
                },
              }
            );
          }),
        ]),
      ],
    }
  );
};

AtRadioTableGroup.props = {
  id: { type: String, default: () => generatorId('at-radio-') },
  valueType: { type: String, default: 'label' },
  items: { type: Array, required: true },
  cols: { type: [Number, String], default: 3 },
  modelValue: {},
  error: { type: [Boolean, String, Number], default: false },
  success: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};
AtRadioTableGroup.emits = ['update:modelValue'];

export default AtRadioTableGroup;
