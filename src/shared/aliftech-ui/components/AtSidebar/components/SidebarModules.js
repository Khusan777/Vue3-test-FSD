import { defineComponent, h } from 'vue';
import AtSelect from '../../AtSelect/AtSelect';
import { ListboxButton } from '@headlessui/vue';
import { SelectorIcon } from '@heroicons/vue/solid';

export default defineComponent({
  name: 'SidebarModules',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [Object, String, Number],
      default: '',
    },
    modules: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedModule: undefined,
    };
  },
  created() {
    this.selectedModule = this.modelValue;
    if (this.selectedModule === '') {
      this.selectedModule = this.modules[0].value;
      this.$emit('update:modelValue', this.selectedModule);
    }
  },
  render() {
    return h('div', { class: ['flex flex-col items-stretch'] }, [
      h(
        AtSelect,
        {
          class: 'w-full',
          options: this.modules,
          modelValue: this.selectedModule,
          onChange: $event => {
            this.selectedModule = $event;
            this.$emit('update:modelValue', $event);
          },
        },
        {
          button: ({ disabled }) => {
            return h(
              ListboxButton,
              {
                class: [
                  'rounded-md cursor-pointer bg-gray-50 relative w-full min-w-20 pl-3 pr-10 py-3 text-left sm:text-sm',
                  'transition duration-200',
                  {
                    ['cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700']:
                      !disabled,
                  },
                  { 'text-gray-500 dark:text-gray-300': !this.selectedModule },
                ],
              },
              {
                default: () => {
                  return [
                    h('div', { class: 'flex items-center' }, [
                      h(
                        'span',
                        { class: ['block truncate text-gray-900 dark:text-white'] },
                        this.modules.find(module => module.value === this.selectedModule)?.title
                      ),
                    ]),
                    h('span', { class: 'absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none' }, [
                      h(SelectorIcon, { class: 'h-5 w-5 text-gray-400', 'aria-hidden': true }),
                    ]),
                  ];
                },
              }
            );
          },
        }
      ),
    ]);
  },
});
