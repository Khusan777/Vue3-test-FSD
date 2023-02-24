import { ref } from 'vue';

export const state = {
  notifications: ref([]),
};

export const methods = {
  remove(id) {
    const removedToast = state.notifications.value.findIndex(item => item.id === id);
    state.notifications.value.splice(removedToast, 1);
  },
  show(options = {}) {
    options.title = options?.title || '';
    options.subTitle = options?.subTitle || '';
    options.type = options?.type || 'info';
    options.duration = options?.duration || 5000;
    const newToast = {
      id: Math.random().toString(36) + new Date().toString(36),
      title: options.title,
      subTitle: options.subTitle,
      type: options.type,
      ...options,
    };
    state.notifications.value.push(newToast);
    if (newToast.duration) {
      setTimeout(() => {
        this.remove(newToast.id);
      }, newToast.duration);
    }
  },
};
