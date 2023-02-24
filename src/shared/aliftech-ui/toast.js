import { createApp } from 'vue';
import AtToast from './components/AtToast/AtToast';
import { methods } from './components/AtToast/notifications';

export default {
  install: () => {
    const container = createApp(AtToast);
    const div = document.createElement('div');
    document.body.appendChild(div);
    container.mount(div);
  },
  show: options => methods.show(options),
  remove: id => methods.remove(id),
  success: options => methods.show({ ...options, type: 'success' }),
  error: options => methods.show({ ...options, type: 'error' }),
  warning: options => methods.show({ ...options, type: 'warning' }),
  info: options => methods.show({ ...options, type: 'info' }),
};
