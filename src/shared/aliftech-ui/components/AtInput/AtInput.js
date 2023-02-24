import { h, ref, defineComponent, defineAsyncComponent } from 'vue';
import { generatorId, transformToBool } from '../../utils';
import { ExclamationCircleIcon } from '@heroicons/vue/solid/esm';
import { setIcon } from './methods/setIcon';

import AtInputAddOn from '../AtInputAddOn/AtInputAddOn';

import { getInputHelpType, setInputBorderClass } from '../../utils/componentsSameFunctions/forms';
import { setInputEvents } from '../../mixins/events/InputEvents';

import './AtInput.scss';
import AtInputHelp from '../AtInputHelp/AtInputHelp';

import InputElements from '../../mixins/props/InputElements';
const InputMask = defineAsyncComponent(() => import('./components/InputMask'));
const AtInputLabel = defineAsyncComponent(() => import('../AtInputLabel/AtInputLabel'));

export default defineComponent({
  name: 'AtInput',
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId('at-input-') },
    modelValue: { type: [String, Number, Date], default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    helpText: { type: String, default: '' },
    hint: { type: String, default: '' },
    addOn: { type: String, default: '' },
    addOnBeforeSelect: { type: Boolean, default: false },
    addOnAfterSelect: { type: Boolean, default: false },
    iconBefore: { type: [String, Object], default: () => '' },
    iconAfter: { type: [String, Object], default: () => '' },
    mask: { type: [String, Array], default: '' },
    masked: { type: Boolean, default: false },
  },
  setup(_, { slots }) {
    const addOnRef = ref(null);
    const addOnBeforeExist = 'addOnBefore' in slots;
    const addOnAfterExist = 'addOnAfter' in slots;
    const trailingButtonExist = 'trailingButton' in slots;

    return {
      addOnRef,
      addOnBeforeExist,
      addOnAfterExist,
      trailingButtonExist,
    };
  },
  render() {
    const isDisabled = transformToBool(this.disabled);
    const inputProps = {
      class: [
        'transition duration-200 shadow-sm block w-full sm:text-sm placeholder-opacity-100 placeholder-gray-600',
        'dark:text-white dark:placeholder-gray-400',
        setInputBorderClass(this.error, this.success),
        {
          'rounded-md': !this.addOnBeforeExist && !this.addOnAfterExist && !this.trailingButtonExist,
          'rounded-none rounded-r-md': this.addOnBeforeExist && !this.addOnAfterExist && !this.trailingButtonExist,
          'rounded-none rounded-l-md': (this.addOnAfterExist || this.trailingButtonExist) && !this.addOnBeforeExist,
          'pl-10': this.iconBefore,
          'pr-10': this.iconAfter,
          'dark:bg-gray-700': !isDisabled,
          'bg-gray-50 dark:bg-gray-600 cursor-not-allowed': isDisabled,
        },
      ],
      style: this.addOnRef ? `padding-left: ${this.addOnRef.clientWidth + 4 || 16}px` : undefined,
      name: this.name,
      placeholder: this.placeholder,
      id: this.id,
      type: this.type,
      disabled: isDisabled,
    };

    const inputEl = this.mask
      ? h(
          InputMask,
          Object.assign({}, inputProps, setInputEvents(this.$emit, this.$attrs), {
            modelValue: this.modelValue,
            mask: this.mask,
            masked: this.masked,
            'onUpdate:modelValue': value => this.$emit('update:modelValue', value),
          })
        )
      : h(
          'input',
          Object.assign({}, inputProps, setInputEvents(this.$emit, this.$attrs), {
            value: this.modelValue,
            onInput: event => this.$emit('update:modelValue', event.target.value),
          })
        );
    return h('div', [
      h('div', { class: 'flex justify-between items-center' }, [
        // Input label
        'label' in this.$slots
          ? this.$slots.label()
          : this.label
          ? h(AtInputLabel, null, { default: () => this.label })
          : null,

        // Hint
        this.hint
          ? h('span', { class: 'text-sm text-gray-500 dark:text-gray-300', id: `${this.id}-optional` }, this.hint)
          : null,
      ]),
      h(
        'div',
        {
          class: [
            {
              'relative rounded-md shadow-sm': this.error || this.iconAfter || this.iconBefore || this.addOn,
              'flex': this.addOnBeforeExist || this.trailingButtonExist || this.addOnAfterExist,
            },
          ],
        },
        [
          // Icon before input
          this.iconBefore ? setIcon(this.iconBefore, 'left') : null,

          // Inline addOn
          this.addOn
            ? h(
                'div',
                {
                  class: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
                  ref: this.addOnRef,
                },
                [h('span', { class: 'text-gray-500 dark:text-gray-300 sm:text-sm' }, this.addOn)]
              )
            : null,

          // AddOn on left side
          this.addOnBeforeExist
            ? h(AtInputAddOn, { select: this.addOnBeforeSelect }, { default: () => this.$slots.addOnBefore() })
            : null,

          // Input element
          h('div', { class: 'relative w-full' }, [
            inputEl,
            this.error
              ? h(
                  'div',
                  {
                    class: [
                      'absolute inset-y-0 right-0 flex items-center pointer-events-none',
                      this.iconAfter ? 'pr-9' : 'pr-3',
                    ],
                  },
                  [h(ExclamationCircleIcon, { class: 'h-5 w-5 text-red-500', 'aria-hidden': true })]
                )
              : null,
          ]),

          this.trailingButtonExist
            ? h(
                'button',
                {
                  type: 'button',
                  class: [
                    '-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md ',
                    'border border-gray-300 text-gray-700',
                    'dark:border-gray-600 dark:text-white',
                    {
                      ['bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-primary-400 dark:focus:border-primary-400']:
                        !isDisabled,
                      'bg-gray-100 dark:bg-gray-800 cursor-not-allowed': isDisabled,
                    },
                  ],
                  onClick: () => (!isDisabled ? this.$emit('trailingButtonClick') : null),
                },
                this.$slots.trailingButton?.()
              )
            : null,

          // AddOn after input
          this.addOnAfterExist
            ? h(
                AtInputAddOn,
                { select: this.addOnAfterSelect, side: 'right' },
                { default: () => this.$slots.addOnAfter() }
              )
            : null,

          // Icon after input
          this.iconAfter ? setIcon(this.iconAfter, 'right') : null,
        ]
      ),

      // Error message and help text printing
      this.error || this.helpText
        ? h(
            AtInputHelp,
            { type: getInputHelpType(this.error, this.success) },
            { default: () => this.helpText || this.error }
          )
        : null,
    ]);
  },
});
