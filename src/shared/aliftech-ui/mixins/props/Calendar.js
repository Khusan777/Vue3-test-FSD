import calendarDates from '../../validations/CalendarDates';
import { ru, uz } from '../../locale';

export default {
  props: {
    range: { type: Boolean, default: false },
    disabledDates: {
      type: [Array, Object],
      validator: calendarDates,
      default: undefined,
    },
    allowedDates: {
      type: [Array, Object],
      validator: calendarDates,
      default: undefined,
    },
    type: {
      type: String,
      default: 'date',
      validator: value => {
        return (
          value === 'date' || value === 'month' || value === 'year' || value === 'quarter' || value === 'half-year'
        );
      },
    },
    startYear: {
      type: [Number, String],
      default: 1900,
    },
    endYear: {
      type: [Number, String],
      default: 2100,
    },
    highlights: {
      type: Array,
      default: () => [],
    },
    locales: {
      type: Object,
      default: () => ({ ru: ru.dates, uz: uz.dates }),
    },
    locale: {
      type: String,
      default: 'ru',
    },
  },
};
