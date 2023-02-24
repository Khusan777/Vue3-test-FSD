import { h, ref, computed, defineComponent } from 'vue';
import { generateSvg } from './methods/generateSvg';
import { generatePath } from './methods/generatePath';

export default defineComponent({
  name: 'AtAlert',
  emits: ['close'],
  props: {
    title: { type: String, default: '' },
    type: {
      type: String,
      default: 'gray',
      validator: type => {
        const hash = {
          gray: true,
          success: true,
          info: true,
          warning: true,
          danger: true,
        };
        return type in hash;
      },
    },
    dismissible: { type: Boolean, default: false },
  },
  setup(props) {
    let closed = ref(false);

    // Render alert icon by it type
    let iconElement = computed(() => {
      switch (props.type) {
        case 'success':
          return generateSvg('text-green-400', [
            generatePath(
              'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            ),
          ]);
        case 'info':
          return generateSvg('text-blue-400', [
            generatePath(
              'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            ),
          ]);
        case 'warning':
          return generateSvg('text-yellow-400', [
            generatePath(
              'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z'
            ),
          ]);
        case 'danger':
          return generateSvg('text-red-400', [
            generatePath(
              'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
            ),
          ]);
        default:
          return generateSvg('text-gray-400', [
            generatePath(
              'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
            ),
          ]);
      }
    });

    // Get alert color by it type
    let colorClass = computed(() => {
      switch (props.type) {
        case 'success':
          return {
            title: 'text-green-800 dark:text-green-300',
            inner: 'text-green-700 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-500 dark:bg-opacity-20',
            button:
              'text-green-500 hover:bg-green-100 focus:bg-green-100 dark:text-white dark:hover:bg-green-400 dark:focus:bg-green-400 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20',
          };
        case 'info':
          return {
            title: 'text-blue-800 dark:text-blue-300',
            inner: 'text-blue-700 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-500 dark:bg-opacity-20',
            button:
              'text-blue-500 hover:bg-blue-100 focus:bg-blue-100 dark:text-white dark:hover:bg-blue-400 dark:focus:bg-blue-400 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20',
          };
        case 'warning':
          return {
            title: 'text-yellow-800 dark:text-yellow-300',
            inner: 'text-yellow-700 dark:text-yellow-400',
            bg: 'bg-yellow-50 dark:bg-yellow-500 dark:bg-opacity-20',
            button:
              'text-yellow-500 hover:bg-yellow-100 focus:bg-yellow-100 dark:text-white dark:hover:bg-yellow-400 dark:focus:bg-yellow-400 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20',
          };
        case 'danger':
          return {
            title: 'text-red-800 dark:text-red-300',
            inner: 'text-red-700 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-500 dark:bg-opacity-20',
            button:
              'text-red-500 hover:bg-red-100 focus:bg-red-100 dark:text-white dark:hover:bg-red-400 dark:focus:bg-red-400 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20',
          };
        default:
          return {
            title: 'text-gray-800 dark:text-white',
            inner: 'text-gray-700 dark:text-gray-300',
            bg: 'bg-gray-50 dark:bg-gray-100 dark:bg-opacity-10',
            button:
              'text-gray-500 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-gray-400 dark:focus:bg-gray-400 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20',
          };
      }
    });

    let titleElement = computed(() => {
      if (props.title) {
        return h('h3', {
          class: ['text-sm leading-5 font-medium', colorClass.value.title],
          innerHTML: props.title,
        });
      }
      return null;
    });

    return {
      closed,
      colorClass,
      iconElement,
      titleElement,
    };
  },
  render() {
    return !this.closed
      ? h(
          'div',
          {
            class: ['rounded-md p-4', this.colorClass.bg],
          },
          [
            h('div', { class: 'flex' }, [
              h('div', { class: 'flex-shrink-0' }, [this.iconElement]),
              h('div', { class: 'ml-3' }, [
                this.titleElement,
                'default' in this.$slots
                  ? h(
                      'div',
                      {
                        class: [
                          'text-sm leading-5',
                          this.colorClass.inner,
                          {
                            'mt-1': 'default' in this.$slots && this.title,
                          },
                        ],
                      },
                      'default' in this.$slots ? this.$slots.default() : null
                    )
                  : null,
              ]),
              this.dismissible
                ? h('div', { class: 'ml-auto pl-3' }, [
                    h('div', { class: '-mx-1.5 -my-1.5' }, [
                      h(
                        'button',
                        {
                          class: [
                            'inline-flex rounded-md p-1.5 focus:outline-none transition ease-in-out duration-150',
                            this.colorClass.button,
                          ],
                          attrs: { 'aria-label': 'Dismiss' },
                          onClick: e => {
                            e.stopPropagation();
                            this.closed = true;
                            this.$emit('close', true);
                          },
                        },
                        [
                          generateSvg('', [
                            generatePath(
                              'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            ),
                          ]),
                        ]
                      ),
                    ]),
                  ])
                : null,
            ]),
          ]
        )
      : null;
  },
});
