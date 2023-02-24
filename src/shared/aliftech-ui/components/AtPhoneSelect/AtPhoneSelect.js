import { h, ref, defineComponent } from 'vue';

import { generatorId, transformToBool } from '../../utils';
import InputElements from '../../mixins/props/InputElements';

import AtInput from '../AtInput/AtInput';
import AtInputAddOnSelect from '../AtInputAddOnSelect/AtInputAddOnSelect';

import tj from '../../assets/flags/tj.svg';
import uz from '../../assets/flags/uz.svg';

export default defineComponent({
  name: 'AtPhoneSelect',
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId('at-phone-select-') },
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: 'Номер телефона' },
    placeholder: { type: String, default: '99 999 99 99' },
    mask: { type: String, default: '## ### ## ##' },
  },
  setup(props) {
    let country = ref('998');
    let phone = ref(props.modelValue);
    if (String(props.modelValue).length === 12) {
      phone.value = props.modelValue.slice(3);
      country.value = props.modelValue.slice(0, 3);
    }
    const prefix = [
      { value: '998', title: '(+998)', flag: 'uz' },
      { value: '992', title: '(+992)', flag: 'tj' },
    ];

    return { country, phone, prefix };
  },
  watch: {
    modelValue() {
      if (this.modelValue.length === 0) {
        this.phone = '';
      }
    },
  },
  render() {
    return h(
      AtInput,
      {
        id: this.id,
        addOnBeforeSelect: true,
        modelValue: this.phone,
        mask: this.mask,
        placeholder: this.placeholder,
        label: this.label,
        error: this.error,
        success: this.success,
        disabled: transformToBool(this.disabled),
        'onUpdate:modelValue': value => {
          this.phone = value;
          this.$emit('update:modelValue', this.country + value);
          this.$emit('onChange', value);
        },
      },
      {
        addOnBefore: () =>
          h(
            AtInputAddOnSelect,
            {
              items: this.prefix,
              modelValue: this.country,
              beforeInput: true,
              disabled: transformToBool(this.disabled),
              'onUpdate:modelValue': value => {
                this.$emit('update:modelValue', value + this.phone);
                this.country = value;
              },
            },
            {
              title: () => {
                return h('div', { class: 'flex items-center' }, [
                  h('img', {
                    src: this.country === '998' ? uz : tj,
                    alt: this.country === '998' ? uz : tj,
                    class: 'w-3 h-3 mr-2',
                  }),
                  this.country,
                ]);
              },
              optionTitle: ({ item }) => {
                return h('div', { class: 'flex items-center' }, [
                  h('img', { src: item.flag === 'uz' ? uz : tj, alt: item.flag, class: 'w-3 h-3 mr-2' }),
                  item.title,
                ]);
              },
            }
          ),
      }
    );
  },
});
