import { h, TransitionGroup } from 'vue';
import { state } from './notifications';
import AtToastItem from '../AtToastItem/AtToastItem';

const AtToast = () => {
  return h('div', { class: 'fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start' }, [
    h('div', { class: 'w-full flex flex-col items-center space-y-4 sm:items-end' }, [
      h(
        TransitionGroup,
        {
          enterActiveClass: 'transform ease-out duration-400 transition',
          enterFromClass: 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2',
          enterToClass: 'translate-y-0 opacity-100 sm:translate-x-0',
          leaveActiveClass: 'transition ease-in duration-200',
          leaveFromClass: 'opacity-100',
          leaveToClass: 'opacity-0',
        },
        {
          default: () => state.notifications.value.map(toast => h(AtToastItem, { ...toast, key: toast.id })),
        }
      ),
    ]),
  ]);
};

export default AtToast;
