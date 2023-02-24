import { h, defineComponent, ref, withDirectives, resolveDirective, toRefs, watch, capitalize } from 'vue';
import AtCalendar from '../AtCalendar/AtCalendar';
import AtInput from '../AtInput/AtInput';
import { generatorId, getHalfYearByDate, getQuarterByDate } from '../../utils';
import { clickOutside } from '../../mixins/directives/clickOutside';
import { short as shortMonths, full as fullMonths } from '../../constants/months';
import { full as fullQuarters } from '../../constants/quarters';
import { full as halfYears } from '../../constants/halfYears';
import InputElements from '../../mixins/props/InputElements';
import Calendar from '../../mixins/props/Calendar';

export default defineComponent({
  name: 'AtDatepicker',
  emits: ['update:modelValue'],
  props: {
    ...InputElements.props,
    ...Calendar.props,
    format: { type: String, default: 'dd-mmm-yyyy' },
    id: { type: String, default: () => generatorId('at-datepicker-') },
    modelValue: { type: [String, Date, Array], default: new Date() },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    helpText: { type: String, default: '' },
    position: { type: String, default: 'left', validator: value => value === 'left' || value === 'right' },
    valueFormat: { type: String, default: undefined },
    hint: { type: String, default: '' },
  },
  directives: { ...clickOutside },
  setup(props, { emit }) {
    const showCalendar = ref(false);
    const modelValue = toRefs(props).modelValue;
    let value = ref('');
    const calendarRef = ref(null);
    const clickOutside = resolveDirective('click-outside');

    watch(
      modelValue,
      () => {
        value.value = '';

        if (!props.range) {
          value.value = '';
          value.value = formatValue(props.modelValue);
        } else {
          const value1 = props.modelValue[0] ? formatValue(props.modelValue[0]) : formatValue(new Date());
          const value2 = props.modelValue[1] ? formatValue(props.modelValue[1]) : formatValue(new Date());

          if (props.type === 'date') {
            value.value = `${value1} – ${value2}`;
          } else {
            value.value = value1;
          }
        }
      },
      { deep: props.range, immediate: true }
    );

    function formatValue(newValue) {
      let result = '';
      const tokens = props.format.match(/\w+/g);
      const separators = props.format.match(/\W+/g);
      if (props.type === 'month') {
        result = capitalize(fullMonths[new Date(newValue).getMonth()]);
      } else if (props.type === 'year') {
        result = new Date(newValue).getFullYear().toString();
      } else if (props.type === 'quarter') {
        result = `${fullQuarters[getQuarterByDate(new Date(newValue))]} - ${new Date(newValue).getFullYear()}`;
      } else if (props.type === 'half-year') {
        result = `${halfYears[getHalfYearByDate(new Date(newValue))]} - ${new Date(newValue).getFullYear()}`;
      } else {
        for (let token of tokens) {
          if (token.toLowerCase().includes('d')) {
            if (token.length <= 2) {
              let day = new Date(newValue).getDate();
              if (day < 10) day = `0${day}`;
              result += `${day}${separators[tokens.indexOf(token)] || ''}`;
            }
          } else if (token.toLowerCase().includes('m')) {
            if (token.length <= 2) {
              let month = new Date(newValue).getMonth() + 1;
              if (month < 10) month = `0${month}`;
              result += `${month}${separators[tokens.indexOf(token)] || ''}`;
            } else {
              let month = capitalize(shortMonths[new Date(newValue).getMonth()]);
              result += `${month}${separators[tokens.indexOf(token)] || ''}`;
            }
          } else if (token.toLowerCase().includes('y')) {
            if (token.length <= 4) {
              let year = new Date(newValue).getFullYear();
              result += `${year}${separators[tokens.indexOf(token)] || ''}`;
            }
          }
        }
      }
      return result;
    }

    function clickOutsideHandler() {
      showCalendar.value = false;
    }
    function updateModelValue(newDate) {
      clickOutsideHandler();
      emit('update:modelValue', newDate);
    }

    return {
      value,
      showCalendar,
      clickOutside,
      calendarRef,
      updateModelValue,
      clickOutsideHandler,
    };
  },
  render() {
    return withDirectives(
      h(
        'div',
        {
          class: 'relative',
        },
        [
          h(AtInput, {
            id: this.id,
            modelValue: this.value,
            label: this.label,
            disabled: this.disabled,
            helpText: this.helpText,
            hint: this.hint,
            iconAfter: { name: 'calendar', type: 'outline' },
            placeholder: 'Выберите дату',
            onFocus: () => (this.showCalendar = true),
            error: this.error,
            success: this.success,
          }),
          this.showCalendar
            ? h(
                'div',
                {
                  class: [
                    'absolute origin-top bg-white dark:bg-gray-700 p-3 mt-2 w-80 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-50',
                    this.position === 'left' ? 'left-0' : 'right-0',
                  ],
                },
                [
                  h(AtCalendar, {
                    type: this.type,
                    range: this.range,
                    disabledDates: this.disabledDates,
                    allowedDates: this.allowedDates,
                    startYear: this.startYear,
                    endYear: this.endYear,
                    modelValue: this.modelValue,
                    highlights: this.highlights,
                    locales: this.locales,
                    locale: this.locale,
                    'onUpdate:modelValue': value => {
                      this.updateModelValue(value);
                    },
                  }),
                ]
              )
            : null,
        ]
      ),
      [[this.clickOutside, this.clickOutsideHandler]]
    );
  },
});
