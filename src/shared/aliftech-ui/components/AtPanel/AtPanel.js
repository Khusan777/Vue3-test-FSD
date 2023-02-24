import { h } from 'vue';

import { transformToBool } from '../../utils';

import AtPanelTitle from '../AtPanelTitle/AtPanelTitle';
import AtPanelSubTitle from '../AtPanelSubTitle/AtPanelSubTitle';

const PANEL_SIZES = {
  sm: 'px-4 py-2',
  md: 'px-4 py-4',
  lg: 'px-6 py-5',
};

const AtPanel = (props, ctx) => {
  const headerElement =
    'header' in ctx.slots || props.title || props.subTitle
      ? h(
          'div',
          {
            class: [
              {
                [PANEL_SIZES?.[props.size]]: !props?.noHeaderPadding,
                'border-b border-gray-200 dark:border-gray-700': transformToBool(props.borderHeader),
              },
            ],
          },
          'header' in ctx.slots
            ? ctx.slots.header({
                title: props.title,
                subTitle: props.subTitle,
              })
            : [
                props.title ? h(AtPanelTitle, { size: props.size }, { default: () => props.title }) : null,
                props.subTitle ? h(AtPanelSubTitle, null, { default: () => props.subTitle }) : null,
              ]
        )
      : undefined;

  return h(
    'div',
    {
      class: [
        'bg-white shadow rounded-lg w-full border border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white',
        {
          'hover:shadow-lg transition duration-200 hover:-translate-y-1 transform': props.lift,
        },
      ],
      style: { marginBlockEnd: 'auto' },
    },
    [
      headerElement,
      'default' in ctx.slots
        ? h(
            'div',
            {
              class: [
                PANEL_SIZES?.[props.size],
                'at-panel-wrapper w-full',
                {
                  'overflow-x-auto': transformToBool(props.overflow),
                },
              ],
            },
            ctx.slots.default()
          )
        : null,
      'footer' in ctx.slots
        ? h(
            'div',
            {
              class: [
                PANEL_SIZES?.[props.size],
                'bg-white rounded-b-lg dark:bg-gray-900 dark:text-white',
                {
                  'border-t border-gray-200 dark:border-gray-700': transformToBool(props.borderFooter),
                },
              ],
            },
            ctx.slots.footer()
          )
        : null,
    ]
  );
};

AtPanel.props = {
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  noHeaderPadding: { type: Boolean, default: false },
  borderHeader: { type: [Boolean, String, Number], default: true },
  borderFooter: { type: [Boolean, String, Number], default: true },
  overflow: { type: [Boolean, String, Number], default: true },
  lift: { type: Boolean, default: false },
  size: { type: String, default: 'lg', validator: value => value && ['sm', 'md', 'lg'].includes(value) },
};

export default AtPanel;
