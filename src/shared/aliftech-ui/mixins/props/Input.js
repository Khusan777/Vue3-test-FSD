import { generatorId } from '../../utils/generatorId';
export const defaultTokens = {
  '#': { pattern: /\d/ },
  X: { pattern: /[0-9a-zA-Z]/ },
  S: { pattern: /[a-zA-Z]/ },
  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
  '!': { escape: true },
};
export default {
  props: {
    value: { default: '' },
    id: {
      type: String,
      default: () => generatorId('at-input-'),
    },
    label: { type: String, default: '' },
    mb: { type: [String, Number], default: 4 },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    mask: { type: [String, Array], default: '' },
    masked: { type: Boolean, default: false },
    tokens: {
      type: Object,
      default: () => ({ ...defaultTokens }),
    },
    iconBefore: { type: String, default: '' },
    iconAfter: { type: String, default: '' },
    disabled: { default: false },
    error: { default: false },
    success: { default: false },
  },
};
