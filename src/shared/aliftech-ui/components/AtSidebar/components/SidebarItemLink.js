import { h } from 'vue';
import { sidebarItemProps } from '../mixins/sidebarMixins';
import { getIconComponent } from '../../../utils';
import { ChevronRightIcon } from '@heroicons/vue/solid/esm';
import { RouterLink } from 'vue-router';

const SidebarItemLink = (props, { emit }) => {
  const buttonClasses = state =>
    state
      ? 'bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md dark:bg-primary-500 dark:bg-opacity-10 dark:text-primary-500'
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md ' +
        'dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:bg-opacity-70 dark:hover:text-white';

  const renderMapOfCollapsedItems = () => {
    return props.item?.routes?.map(item =>
      h(
        RouterLink,
        {
          to: Object.assign({}, item?.to),
          class: ['pl-10', buttonClasses(props.routeName === item?.to?.name)],
        },
        {
          default: () => [
            item?.title,
            item?.count
              ? h(
                  'span',
                  {
                    class: [
                      'bg-gray-100 group-hover:bg-gray-200 inline-block py-0.5 px-3 text-xs font-medium rounded-full ml-auto',
                      'dark:bg-primary-500 dark:bg-opacity-10 dark:text-primary-500 dark:group-hover:bg-primary-600',
                    ],
                  },
                  item?.count
                )
              : null,
          ],
        }
      )
    );
  };

  const renderSingleItem = () =>
    h(
      RouterLink,
      {
        to: props.item?.to,
        class: [buttonClasses(props.active)],
      },
      {
        default: () => [
          props.item.icon
            ? h(getIconComponent(props.item.icon).Icon, {
                class: [
                  'mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500',
                  'dark:text-gray-300 dark:group-hover:text-gray-200',
                  {
                    'text-gray-500 dark:text-gray-200': props.routeName === props.item?.to?.name,
                  },
                ],
              })
            : null,
          props.item?.title,
          props.item?.count
            ? h(
                'span',
                {
                  class: [
                    'bg-gray-100 group-hover:bg-gray-200 inline-block py-0.5 px-3 text-xs font-medium rounded-full ml-auto',
                    'dark:bg-primary-500 dark:bg-opacity-10 dark:text-primary-500 dark:group-hover:bg-primary-600',
                  ],
                },
                props.item?.count
              )
            : null,
        ],
      }
    );

  const renderCollapseItem = () =>
    h('div', { class: ['space-y-1'] }, [
      h(
        'button',
        {
          type: 'button',
          class: [
            'group w-full flex items-center pl-2 pr-1 py-2 text-sm font-medium rounded-md ' +
              'hover:text-gray-900 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:hover:bg-gray-900 dark:hover:bg-opacity-70',
            props.collapsed || props.item?.routes?.some(item => item?.to?.name === props.routeName)
              ? 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:bg-opacity-70 dark:text-white'
              : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200',
          ],
          onClick: e => {
            e.stopPropagation();
            emit('click');
          },
        },
        [
          props.item.icon
            ? h(getIconComponent(props.item.icon).Icon, {
                class: [
                  'mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500',
                  'dark:text-gray-300 dark:group-hover:text-gray-300',
                ],
              })
            : null,
          props.item?.title,
          h('div', { class: ['ml-auto flex items-center'] }, [
            props.item?.count
              ? h(
                  'span',
                  {
                    class: [
                      'bg-gray-100 group-hover:bg-gray-200 inline-block py-0.5 px-3 text-xs font-medium rounded-full ml-auto',
                      'dark:bg-gray-800 dark:group-hover:bg-gray-900',
                    ],
                  },
                  props.item?.count
                )
              : null,
            h(ChevronRightIcon, {
              class: [
                'transform ease-in-out duration-150 mx-2 h-5 w-5 text-gray-400',
                {
                  'rotate-90': props.collapsed || props.item?.routes?.some(item => item?.to?.name === props.routeName),
                },
              ],
            }),
          ]),
        ]
      ),
      h(
        'div',
        {
          class: [
            'space-y-1 sidebar-collapse-block ',
            {
              'is-collapsed': props.collapsed || props.item?.routes?.some(item => item?.to?.name === props.routeName),
            },
          ],
        },
        [renderMapOfCollapsedItems()]
      ),
    ]);

  return props.item?.routes && props.item?.routes?.length ? renderCollapseItem() : renderSingleItem();
};

SidebarItemLink.props = {
  routeName: { type: String, default: '' },
  collapsed: { type: Boolean, default: false },
  ...sidebarItemProps.props,
};

export default SidebarItemLink;
