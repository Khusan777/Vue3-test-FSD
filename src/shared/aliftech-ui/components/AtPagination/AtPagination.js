import { h, ref } from 'vue';
import PaginationLink from './components/PaginationLink';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid/esm';
import useGeneratePages from '../../hooks/useGeneratePages';

const getPage = value => {
  const parsed = parseInt(value, 10);
  if (Number.isInteger(parsed)) {
    return parsed;
  }
  return undefined;
};

const AtPagination = (props, ctx) => {
  let nowPage = ref(1);

  const { generatePages } = useGeneratePages();

  const changePage = page => {
    nowPage.value = page;
    ctx.emit('update:modelValue', page);
  };

  const pages = () => {
    return Number.isInteger(getPage(nowPage.value)) && Number.isInteger(getPage(props.total))
      ? generatePages(getPage(nowPage.value), getPage(props.total))
      : [];
  };

  nowPage.value = getPage(props.modelValue || 1);

  return h('nav', { class: ['relative z-0 inline-flex shadow-sm'] }, [
    h(
      PaginationLink,
      {
        class: 'inline-flex px-2.5 rounded-l-md',
        selected: false,
        onClick: e => {
          e.stopPropagation();
          const num = getPage(nowPage.value);
          if (Number.isInteger(num)) {
            const newPage = Math.max(1, num - 1);
            if (newPage !== num) {
              changePage(newPage);
            }
          }
        },
      },
      {
        default: () => {
          return h(ChevronLeftIcon, { style: [{ width: '16px', height: '16px' }] });
        },
      }
    ),
    pages().map((page, index) =>
      h(
        PaginationLink,
        {
          class:
            page.title === '...'
              ? '-ml-px inline-flex px-4'
              : ['-ml-px px-4', { 'hidden md:inline-flex': page.hidden, 'inline-flex': !page.hidden }],
          selected: nowPage.value === page.page,
          onClick: e => {
            e.stopPropagation();
            if (page.page !== nowPage.value) {
              changePage(page.page);
            }
          },
          key: 'at-pagination-button-page-' + index,
        },
        {
          default: () => {
            return page.title === '...' ? page.title : page.page;
          },
        }
      )
    ),
    h(
      PaginationLink,
      {
        class: 'inline-flex px-2.5 -ml-px rounded-r-md',
        selected: false,
        onClick: e => {
          e.stopPropagation();
          const num = getPage(nowPage.value);
          const numTotal = getPage(props.total);
          if (Number.isInteger(num) && Number.isInteger(numTotal)) {
            const newPage = Math.min(numTotal, num + 1);
            if (newPage > num) {
              changePage(newPage);
            }
          }
        },
      },
      {
        default: () => {
          return h(ChevronRightIcon, { style: [{ width: '16px', height: '16px' }] });
        },
      }
    ),
  ]);
};

AtPagination.props = {
  modelValue: { type: [Number, String], default: 1 },
  total: { type: [Number, String], default: 0 },
};

export default AtPagination;
