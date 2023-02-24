import { generatorId } from '../../utils/generatorId';
export default {
  props: {
    id: {
      type: String,
      default: () => generatorId('at-datepicker-'),
    },
    label: { type: String, default: '' },
    disabled: { type: [Boolean, Number, String], default: false },
    error: { type: [Boolean, Number, String, Array], default: false },
    success: { type: [Boolean, Number, String], default: false },
  },
};
