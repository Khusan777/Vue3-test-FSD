import { h } from 'vue';
import { generatorId, transformToBool } from '../../utils';
import AtInputHelp from '../AtInputHelp/AtInputHelp';
import { getInputHelpType } from '../../utils/componentsSameFunctions/forms';

const AtRadioOption = (props, { emit }) => {
  const isDisabled = transformToBool(props.disabled);

  return h('div', [
    h(
      'label',
      {
        class: [
          'rounded-tl-md rounded-tr-md relative flex cursor-pointer focus:outline-non',
          { 'cursor-not-allowed': isDisabled },
        ],
      },
      [
        h('input', {
          value: props.value,
          checked: props.value === props.modelValue,
          disabled: isDisabled,
          type: 'radio',
          class: [
            'h-4 w-4 mt-0.5',
            !props.error && !props.success
              ? [
                  'border-gray-300',
                  'text-primary-600',
                  'focus:ring-primary-500',
                  'dark:text-primary-500',
                  'dark:focus:ring-offset-gray-900',
                  'dark:focus:ring-primary-400',
                ]
              : '',
            {
              'cursor-pointer': !isDisabled,
              'cursor-not-allowed': isDisabled,
              'border-red-300 text-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:focus:ring-red-400 dark:focus:ring-offset-gray-900':
                props.error,
              'border-green-500 text-green-500 focus:ring-green-500 dark:border-green-500 dark:text-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-gray-900':
                props.success,
            },
          ],
          name: props.name,
          'aria-labelledby': props.id + 'label',
          'aria-describedby': props.id + 'description',
          onInput: e => {
            e.preventDefault();
            e.stopPropagation();
            emit('update:modelValue', e.target.value);
          },
        }),
        props.label || props.description
          ? h('div', { class: 'ml-3 flex flex-col' }, [
              props.label
                ? h(
                    'span',
                    {
                      class: [
                        'block text-sm font-medium',
                        props.modelValue === props.value
                          ? ['text-primary-900', 'dark:text-primary-500']
                          : 'text-gray-900 dark:text-white',
                      ],
                      id: props.id + 'label',
                    },
                    props.label
                  )
                : null,
              props.description
                ? h(
                    'span',
                    {
                      class: [
                        'block text-sm',
                        props.modelValue === props.value
                          ? ['text-primary-700', 'dark:text-primary-300']
                          : 'text-gray-500 dark:text-white',
                      ],
                      id: props.id + 'description',
                    },
                    props.description
                  )
                : null,
            ])
          : null,
      ]
    ),
    props.error
      ? h(AtInputHelp, { type: getInputHelpType(props.error, props.success), mt: null }, { default: () => props.error })
      : null,
  ]);
};

AtRadioOption.props = {
  id: { type: String, default: () => generatorId('at-radio-option-') },
  modelValue: { type: [String, Number, Boolean], default: '' },
  value: { type: [String, Number, Boolean], default: '' },
  name: { type: String, default: generatorId('at-radio-option-name') },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  error: { type: [Boolean, String, Number], default: false },
  success: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};
AtRadioOption.emits = ['update:modelValue'];

export default AtRadioOption;
