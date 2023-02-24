import { h, defineComponent } from 'vue';

import AtButton from '../AtButton/AtButton';
import { renderNotFoundImg } from './methods';

export default defineComponent({
  name: 'AtNotFoundPage',
  props: {
    title: { type: String, default: '-' },
    description: { type: String, default: '-' },
    btnTitle: { type: String, default: 'Вернуться на главную' },
    btnColor: { type: String, default: 'primary' },
    color: { type: String, default: 'indigo' },
  },
  render() {
    return h('div', {}, [
      h('div', { class: '' }, [
        h('div', { class: 'grid md:grid-cols-2 gap-12 justify-center py-12 items-center' }, [
          h('div', { class: 'flex justify-end mb-4 md:mb-0' }, [renderNotFoundImg(this.color)]),
          h('div', { class: 'mb-4 md:mb-0' }, [
            h('div', { class: 'mb-6 text-center md:text-left' }, [
              h('h1', { class: 'text-3xl font-semibold' }, this.title),
              h('span', { class: 'text-base mt-4 block' }, this.description),
            ]),
            h('div', { class: 'flex justify-center md:justify-start' }, [
              h(AtButton, { color: this.btnColor, to: { path: '/' } }, { default: () => this.btnTitle }),
            ]),
          ]),
        ]),
      ]),
    ]);
  },
});
