import { h, Transition } from 'vue';
import { generatorId, transformToBool } from '../../utils';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/solid';

const AtInputAddOnSelect = (props, { emit, slots }) => {
  return h(
    Menu,
    { class: 'relative inline-block text-left', as: 'div' },
    {
      default: () => {
        return [
          h('div', [
            h(
              MenuButton,
              {
                class: [
                  'inline-flex justify-center px-3 focus:ring-primary-500 focus:border-primary-500 h-full py-0 border-transparent bg-transparent text-gray-500 sm:text-sm dark:text-white dark:focus:ring-primary-600 dark:focus:border-primary-600',
                  props.side === 'left' ? 'rounded-l-md' : 'rounded-r-md',
                  { 'cursor-not-allowed': transformToBool(props.disabled) },
                ],
              },
              {
                default: () => {
                  return [
                    'title' in slots
                      ? slots.title()
                      : props.items.find(item => item?.[props.valueType] === props.modelValue)?.[props.valueTitle] ||
                        props.modelValue,
                    h(ChevronDownIcon, {
                      class: 'w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100',
                      'aria-hidden': 'true',
                    }),
                  ];
                },
              }
            ),
          ]),
          h(
            Transition,
            {
              enterActiveClass: 'transition duration-100 ease-out',
              enterFromClass: 'transform scale-95 opacity-0',
              enterToClass: 'transform scale-100 opacity-100',
              leaveFromClass: 'transform scale-100 opacity-100',
              leaveActiveClass: 'transition duration-75 ease-in',
              leaveToClass: 'transform scale-95 opacity-0',
            },
            {
              default: () => {
                return h(
                  MenuItems,
                  {
                    class:
                      'absolute left-0 z-10 w-max mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                  },
                  {
                    default: () => {
                      return h('div', { class: 'pa-1' }, [
                        props.items.map(item =>
                          h(
                            MenuItem,
                            {},
                            {
                              default: () => {
                                return h(
                                  'button',
                                  {
                                    class: [
                                      item[props.valueType] === props.modelValue ? 'bg-gray-100' : '',
                                      'group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-900',
                                    ],
                                    onClick: event => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      emit('update:modelValue', item[props.valueType]);
                                    },
                                  },
                                  ['optionTitle' in slots ? slots.optionTitle({ item }) : item.title]
                                );
                              },
                            }
                          )
                        ),
                      ]);
                    },
                  }
                );
              },
            }
          ),
        ];
      },
    }
  );
};

AtInputAddOnSelect.props = {
  id: { type: String, default: () => generatorId('at-input-add-on-select-') },
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, default: [] },
  valueType: { type: String, default: 'value' },
  valueTitle: { type: String, default: 'title' },
  side: { type: String, default: 'left', validator: value => value === 'left' || value === 'right' },
  disabled: { type: [Boolean, Number, String], default: false },
};

export default AtInputAddOnSelect;
