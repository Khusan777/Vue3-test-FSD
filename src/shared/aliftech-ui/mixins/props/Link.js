import RouterLocation from '../../validations/RouterLocation';
export default {
  props: {
    to: {
      type: [Object, String],
      validator: to => RouterLocation(to),
      default: '',
    },
    replace: { type: Boolean, default: false },
    append: { type: Boolean, default: false },
    activeClass: { type: String, default: 'router-link-active' },
    exact: { type: Boolean, default: false },
    exactActiveClass: { type: String, default: 'router-link-exact-active' },
    ariaCurrentValue: {
      type: String,
      default: 'page',
      validator: ariaCurrentValue =>
        ariaCurrentValue === 'page' ||
        ariaCurrentValue === 'step' ||
        ariaCurrentValue === 'location' ||
        ariaCurrentValue === 'date' ||
        ariaCurrentValue === 'time',
    },
  },
};
