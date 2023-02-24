import { h } from 'vue';
import { getIconComponent, hasOwnProperty } from '../../utils';
import noPhoto from '../../assets/img/no_photo.png';
import { dateParser } from '../../utils/parsers';

const AtFeeds = props => {
  const commentTypeFeed = item =>
    h('div', { class: 'relative flex items-start space-x-3' }, [
      h('div', { class: 'relative' }, [
        h('img', {
          src: item.image || noPhoto,
          alt: item.title,
          class: [
            'h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white object-cover',
            'dark:bg-gray-100 dark:ring-gray-900',
          ],
        }),
        item.icon
          ? h(
              'span',
              {
                class: 'absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px',
              },
              [
                h(getIconComponent(item.icon).Icon, {
                  class: 'h-5 w-5 text-gray-400 dark:text-gray-900',
                  'aria-hidden': true,
                }),
              ]
            )
          : null,
      ]),
      h('div', { class: 'min-w-0 flex-1' }, [
        h('div', [
          h('div', { class: 'text-sm' }, [
            h('span', { class: 'font-medium text-gray-900 dark:text-white' }, item.title),
          ]),
          h('p', { class: 'mt-0.5 text-sm text-gray-500 dark:text-gray-300' }, dateParser(item.date)),
        ]),
        h('div', { class: 'mt-2 text-sm text-gray-700 dark:text-gray-200' }, [h('p', item.content)]),
      ]),
    ]);

  const simpleTypeFeed = item =>
    h('div', { class: 'relative flex space-x-3' }, [
      h('div', [
        h(
          'span',
          {
            class: [
              item.iconBgColor ? 'bg-' + item.iconBgColor + '-500' : 'bg-gray-400 dark:bg-gray-100',
              'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
              { 'mx-1': props.items.some(item => item.type && item.type === 'comment') },
            ],
          },
          [h(getIconComponent(item.icon).Icon, { class: 'h-5 w-5 text-white dark:text-gray-900', 'aria-hidden': true })]
        ),
      ]),
      h('div', { class: 'min-w-0 flex-1 pt-1.5 flex justify-between space-x-4' }, [
        h('div', [
          h('p', { class: 'text-sm text-gray-500 dark:text-gray-300' }, [
            item.title,
            h('span', { class: 'font-medium text-gray-900 ml-1 dark:text-white' }, item.content),
          ]),
        ]),
        item.date
          ? h('div', { class: 'text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-300' }, [
              h('time', { datetime: item.date }, dateParser(item.date)),
            ])
          : null,
      ]),
    ]);

  return h('div', { class: 'flow-root' }, [
    h('ul', { class: '-mb-8', role: 'list' }, [
      props.items.length
        ? props.items.map((item, itemIdx) => {
            return h('li', null, [
              h('div', { class: 'relative pb-8' }, [
                itemIdx !== props.items.length - 1
                  ? h('span', {
                      class: [
                        'absolute top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-400',
                        props.items.some(item => item.type && item.type === 'comment') ? 'left-5' : 'left-4',
                      ],
                      'aria-hidden': true,
                    })
                  : null,
                item.type && item.type === 'comment' ? commentTypeFeed(item) : simpleTypeFeed(item),
              ]),
            ]);
          })
        : null,
    ]),
  ]);
};

AtFeeds.props = {
  items: {
    type: Array,
    required: true,
    validator: items => {
      return items.every(item => hasOwnProperty(item, 'title') && hasOwnProperty(item, 'content'));
    },
  },
};

export default AtFeeds;
