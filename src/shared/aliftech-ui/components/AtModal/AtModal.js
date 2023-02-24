import { h, computed, Teleport } from 'vue';
import { XIcon } from '@heroicons/vue/solid/esm';

import AtModalTitle from '../AtModalTitle/AtModalTitle';

import { transformToBool } from '../../utils/transformToBool';
import { generatorId } from '../../utils/generatorId';

import './AtModal.scss';

import { modalDialogSizes } from '../../constants/modalDialogSizes';
import { checkType } from '../../utils';

let selectedModal = null;

const setOverflow = value => {
  const body = document.querySelector('body');
  const atSidebar = document.querySelector('.at-sidebar');

  if (checkType(body, 'HTMLBodyElement') && 'style' in body) {
    body.style.overflow = value;
  }

  if (checkType(atSidebar, 'HTMLDivElement') && 'style' in atSidebar) {
    atSidebar.style.overflow = value;
  }
};

const AtModal = (props, ctx) => {
  selectedModal = props.id;

  const toggleVisible = visible => {
    if (props.id === selectedModal) {
      setOverflow(visible ? 'hidden' : 'auto');
    }
  };

  const slotProps = computed(() => {
    return {
      value: transformToBool(props.modelValue),
      title: props.title,
      description: props.description,
      close: () => {
        toggleVisible(false);
        ctx.emit('update:modelValue', false);
      },
    };
  });

  return h(
    Teleport,
    { to: 'body' },
    h(
      'div',
      {
        class: [
          'fixed inset-0 overflow-y-auto p-4 md:py-7 at-modal z-10',
          {
            'display': props.modelValue,
          },
        ],
        'at-modal': props.id,
        on: props.events,
      },
      [
        h('div', {
          class: 'fixed inset-0 bg-gray-500 at-modal-back',
          onClick: () => {
            toggleVisible(false);
            ctx.emit('update:modelValue', false);
          },
        }),
        h('div', { class: 'at-modal-wrapper m-auto max-h-full flex' }, [
          h(
            'div',
            {
              class: [
                'rounded-lg text-left shadow-xl relative flex flex-col overflow-hidden',
                modalDialogSizes[props.size],
                'sm:w-full bg-white dark:bg-gray-800',
                'footer' in ctx.slots ? 'pt-5 sm:pt-6' : 'pt-5 sm:pt-6',
              ],
            },
            [
              h('div', { class: 'sm:block absolute top-0 right-0 pt-4 pr-4' }, [
                h(
                  'button',
                  {
                    class:
                      'outline-none text-gray-400 dark:text-white hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none',
                    onClick: () => {
                      toggleVisible(false);
                      ctx.emit('update:modelValue', false);
                    },
                  },
                  [h(XIcon, { style: [{ width: '24px', height: '24px' }] })]
                ),
              ]),
              h('div', { class: 'mb-2 px-4 sm:px-6' }, [
                'title' in ctx.slots
                  ? ctx.slots.title(slotProps.value)
                  : props.title
                  ? h(AtModalTitle, {}, { default: () => props.title })
                  : null,
              ]),
              h(
                'div',
                {
                  class:
                    'h-full text-sm text-gray-500 dark:text-gray-300 flex flex-col pb-4 sm:pb-6 w-screen max-w-full overflow-auto px-4 sm:px-6',
                },
                [
                  'default' in ctx.slots
                    ? ctx.slots?.default(slotProps.value)
                    : props.description
                    ? h('p', props.description)
                    : null,
                ]
              ),
              'footer' in ctx.slots
                ? h(
                    'div',
                    { class: 'bg-gray-50 dark:bg-gray-900 dark:text-white px-4 py-3 sm:px-6 block' },
                    ctx.slots.footer(slotProps.value)
                  )
                : null,
            ]
          ),
        ]),
      ]
    )
  );
};

AtModal.props = {
  id: { type: String, default: () => generatorId('at-modal-') },
  modelValue: { type: [Boolean, String, Number], default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: size => Object.prototype.hasOwnProperty.call(modalDialogSizes, size),
  },
};

export default AtModal;
