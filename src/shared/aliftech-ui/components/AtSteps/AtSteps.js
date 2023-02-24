import { h, ref, toRefs, watch, computed, onBeforeMount, defineComponent } from 'vue';
import { transformToBool, comparisonValues, getIconComponent, deepCopy } from '../../utils';

export default defineComponent({
  name: 'AtSteps',
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: [String, Number], default: '' },
    steps: {
      type: Array,
      required: true,
      validator: steps =>
        Array.isArray(steps) &&
        steps.every(
          step => Object.prototype.toString.call(step) === '[object Object]' && 'title' in step && 'value' in step
        ),
    },
    disabled: { type: [Boolean, String, Number], default: false },
  },
  setup(props, { emit }) {
    const step = ref(undefined);
    const modelValue = toRefs(props).modelValue;

    const disabled = computed(() => transformToBool(props.disabled));
    const buttons = computed(() => {
      const steps = [];
      let active = false;
      for (let i = props.steps.length - 1; i >= 0; i--) {
        if (Object.prototype.toString.call(props.steps[i]) === '[object Object]') {
          // Подзаголовок
          let subTitle = undefined;
          if ('subTitle' in props.steps[i] && props.steps[i].subTitle) {
            subTitle = props.steps[i].subTitle;
          }
          // Подзаголовок - END
          // Иконка
          let icon = undefined;
          if ('icon' in props.steps[i] && props.steps[i].icon) {
            icon = h(getIconComponent(props.steps[i].icon).Icon, { class: subTitle ? 'h-7 w-7' : 'h-4 w-4' });
          }
          // Иконка - END
          // Значение тек. элемента
          if ('value' in props.steps[i]) {
            if (!active && comparisonValues(props.steps[i].value, deepCopy(step.value))) {
              active = true;
            }
          }
          // Значение тек. элемента - END
          // Элементы внутри кнопок
          const elements = [];
          if ('title' in props.steps[i]) {
            elements.push(
              h(
                'span',
                {
                  class: [
                    'block text-xs leading-4 font-semibold uppercase',
                    'group-hover:text-primary-800',
                    'dark:group-hover:text-primary-400',
                    'transition ease-in-out duration-150',
                    active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-300',
                  ],
                },
                props.steps[i].title
              )
            );
          }
          if (subTitle) {
            elements.push(h('span', { class: 'block text-sm leading-5 font-medium dark:text-white' }, subTitle));
          }
          // Элементы внутри кнопок - END
          let element = elements;
          if (icon) {
            element = [
              h('div', { class: 'flex items-center flex-wrap' }, [
                h(
                  'div',
                  {
                    class: [
                      'block',
                      {
                        'mr-3': subTitle,
                        'mr-2': !subTitle,
                      },
                      active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-300',
                    ],
                  },
                  [icon]
                ),
                h('div', { class: 'block' }, [elements]),
              ]),
            ];
          }
          steps.unshift(
            h('li', { class: 'md:flex-1', key: 'at-steps-' + i }, [
              h(
                'button',
                {
                  onClick: e => {
                    e.stopPropagation();
                    if (!disabled.value && 'value' in props.steps[i]) {
                      emit('update:modelValue', props.steps[i].value);
                    }
                  },
                  class: [
                    'w-full text-left pl-4 py-2 block border-l-4 transition ease-in-out duration-150 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 outline-none focus:outline-none',
                    active
                      ? [
                          'border-primary-600',
                          'hover:border-primary-800',
                          'focus:border-primary-900',
                          'dark:border-primary-400',
                          'dark:hover:border-primary-300',
                          'dark:focus:border-primary-700',
                        ]
                      : [
                          'border-gray-200 hover:border-gray-300 focus:border-gray-400',
                          'dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-gray-500',
                        ],
                  ],
                },
                element
              ),
            ])
          );
        }
      }
      return steps;
    });

    watch(modelValue, value => (step.value = deepCopy(value)));

    onBeforeMount(() => {
      if (modelValue.value === undefined) {
        if (
          Array.isArray(props.steps) &&
          props.steps.length &&
          Object.prototype.toString.call(props.steps[0]) === '[object Object]' &&
          'value' in props.steps[0]
        ) {
          step.value = deepCopy(props.steps[0].value);
        }
      } else {
        step.value = deepCopy(modelValue.value);
      }
    });

    return () => h('nav', null, [h('ul', { class: 'space-y-4 md:flex md:space-y-0 md:space-x-8' }, [buttons.value])]);
  },
});
