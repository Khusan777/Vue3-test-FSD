import './AtCheckbox.scss';

import { h } from 'vue';
import { transformToBool, generatorId } from '../../utils';
import InputElements from '../../mixins/props/InputElements';

import AtSwitch from '../AtSwitch/AtSwitch';
import AtInputHelp from '../AtInputHelp/AtInputHelp';
import { getInputHelpType } from '../../utils/componentsSameFunctions/forms';

const AtCheckbox = (props, context) => {
  const isDisabled = transformToBool(props.disabled);
  return h(
    'div',
    {
      class: ['block w-full'].concat('class' in context.attrs ? context.attrs.class : {}),
    },
    [
      h('div', { class: ['relative flex items-start', { 'cursor-not-allowed': isDisabled }] }, [
        h('div', { class: 'flex items-center h-5' }, [
          h('input', {
            class: [
              'border-gray-300 rounded h-4 w-4 transition duration-150 ease-in-out',
              !props.error && !props.success
                ? [
                    'text-primary-600',
                    'focus:ring',
                    'focus:ring-primary-500',
                    'focus:border-primary-300',
                    'dark:text-primary-500',
                    'dark:focus:ring-offset-gray-900',
                    'dark:focus:ring-primary-600',
                    'dark:focus:border-primary-400',
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
            type: 'checkbox',
            checked: transformToBool(props.modelValue),
            disabled: isDisabled,
            id: props.id,
            onInput: e => {
              e.stopPropagation();
              if (
                'target' in e &&
                Object.prototype.toString.call(e.target) === '[object HTMLInputElement]' &&
                'checked' in e.target
              ) {
                context.emit('update:modelValue', e.target.checked);
              }
            },
          }),
        ]),
        props.label || 'default' in context.slots
          ? h(
              AtSwitch,
              { id: props.id, disabled: isDisabled },
              {
                default: () => [
                  props.label,
                  'default' in context.slots
                    ? h(
                        'span',
                        { class: 'text-gray-500 block font-normal dark:text-gray-300' },
                        context.slots.default()
                      )
                    : null,
                ],
              }
            )
          : null,
      ]),
      props.error
        ? h(
            AtInputHelp,
            { type: getInputHelpType(props.error, props.success), mt: null },
            { default: () => props.error }
          )
        : null,
    ]
  );
};

AtCheckbox.props = {
  ...InputElements.props,
  id: { type: String, default: () => generatorId('at-checkbox-') },
  modelValue: { type: [Boolean, String, Number], default: false },
};

export default AtCheckbox;
