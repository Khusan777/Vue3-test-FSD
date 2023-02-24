import { h } from 'vue';
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { generatorId, getIconComponent, transformToBool } from '../../utils';

const xIcon = (
  <svg class='h-3 w-3 text-gray-400 dark:text-white' fill='none' viewBox='0 0 12 12'>
    <path
      d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
  </svg>
);

const yIcon = (
  <svg class={['h-3 w-3 text-primary-600']} fill='currentColor' viewBox='0 0 12 12'>
    <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
  </svg>
);

const AtToggle = (props, { emit }) => {
  const iconWithoutLabel = h(
    Switch,
    {
      class: [
        props.modelValue ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-600',
        'flex-shrink-0 relative rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-900 focus:ring-primary-500',
        props.short
          ? 'group inline-flex items-center justify-center h-5 w-10'
          : 'inline-flex border-2 border-transparent transition-colors ease-in-out duration-200 h-6 w-11',
        props.disabled ? 'cursor-not-allowed opacity-50' : '',
      ],
      modelValue: transformToBool(props.modelValue),
      'onUpdate:modelValue': value => {
        if (!props.disabled) {
          emit('update:modelValue', value);
          emit('onToggle', value);
        }
      },
    },
    {
      default: () => [
        props.short
          ? h('span', {
              class: 'pointer-events-none absolute bg-white w-full h-full rounded-md dark:bg-gray-900',
              'aria-hidden': true,
            })
          : null,
        props.short
          ? h('span', {
              class: [
                props.modelValue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600',
                'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
              ],
              'aria-hidden': true,
            })
          : null,
        h(
          'span',
          {
            class: [
              props.modelValue ? 'translate-x-5 dark:bg-white' : 'translate-x-0 dark:bg-gray-800',
              'pointer-events-none shadow h-5 w-5 ease-in-out duration-200 transform bg-white ring-0 rounded-full',
              props.short
                ? 'absolute left-0 inline-block border border-gray-200 transition-transform dark:border-gray-700'
                : 'inline-block transition',
            ],
            'aria-hidden': true,
          },
          [
            props.icon
              ? h('span', { class: 'flex h-full w-full items-center justify-center' }, [
                  h(getIconComponent(props.icon).Icon, {
                    class: ['h-3 w-3', props.modelValue ? 'text-primary-600' : 'text-gray-900 dark:text-white'],
                  }),
                ])
              : null,
            !props.icon && props.withIcon
              ? props.modelValue
                ? h(
                    'span',
                    {
                      class: [
                        'opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
                      ],
                      'aria-hidden': true,
                    },
                    yIcon
                  )
                : h(
                    'span',
                    {
                      class: [
                        'opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
                      ],
                      'aria-hidden': true,
                    },
                    xIcon
                  )
              : null,
          ]
        ),
      ],
    }
  );

  const iconWithLabel = h(
    SwitchGroup,
    {
      as: 'div',
      class: ['flex items-center', { 'justify-between': props.labelPosition === 'left' }],
    },
    {
      default: () => [
        props.labelPosition === 'right' ? h('span', { class: 'mr-3' }, [iconWithoutLabel]) : null,
        h('span', { class: 'flex-grow flex flex-col' }, [
          h(
            SwitchLabel,
            {
              as: 'span',
              class: 'text-sm font-medium text-gray-900 dark:text-white pr-3',
              passive: true,
            },
            { default: () => props.label }
          ),
          props.description
            ? h(
                SwitchDescription,
                { as: 'span', class: 'text-sm text-gray-500 dark:text-gray-300' },
                { default: () => props.description }
              )
            : null,
        ]),
        props.labelPosition === 'left' ? iconWithoutLabel : null,
      ],
    }
  );

  return props.label ? iconWithLabel : iconWithoutLabel;
};

AtToggle.props = {
  id: { type: String, default: () => generatorId('at-switch-') },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'left',
    validator: value => value === 'left' || value === 'right',
  },
  description: { type: String, default: '' },
  modelValue: { type: [Boolean, String, Number], default: false },
  short: { type: Boolean, default: false },
  withIcon: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
};

export default AtToggle;
