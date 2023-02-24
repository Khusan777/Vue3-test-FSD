import { h, ref, computed, watch, Transition, capitalize, toRefs, defineComponent, nextTick } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline/esm';
import { ChevronDownIcon } from '@heroicons/vue/solid/esm';
import { checkType, getDateByHalfYear, getHalfYearByDate, getQuarterByDate, getDateByQuarter } from '../../utils';
import Calendar from '../../mixins/props/Calendar';
import AtTooltip from '../AtTooltip/AtTooltip';

export default defineComponent({
  name: 'AtCalendar',
  emits: ['update:modelValue', 'scroll'],
  props: {
    ...Calendar.props,
    modelValue: { type: [String, Date, Array], default: new Date() },
  },
  setup(props, { emit }) {
    //// Properties
    let currentMonth = ref(new Date().getMonth() + 1);
    let selectedMonth = ref(new Date().getMonth() + 1);
    let currentYear = ref(new Date().getFullYear());
    let selectedYear = ref(new Date().getFullYear());
    let selectedQuarter = ref(getQuarterByDate(new Date()));
    let selectedHalfYear = ref(getHalfYearByDate(new Date()));
    let monthDays = ref([]);
    let showMonthYearDropdown = ref(false);
    let selectedDay = ref(null);
    let value = toRefs(props).modelValue;
    let dateRange = ref([]);
    let startYear = toRefs(props).startYear;
    let endYear = toRefs(props).endYear;
    let rootRefEl = ref(null);
    // let dateRangeBetweenDays = ref(0);
    const rangePointsClasses =
      'after:w-6/12 after:h-full after:absolute after:right-0 after:bg-primary-100 dark:after:bg-primary-500 dark:after:bg-opacity-30';
    const tooltipConfig = {
      placement: 'top',
      offset: [0, 4],
      trigger: 'hover',
      teleport: true,
      teleportToRef: rootRefEl,
    };
    //// Properties -END

    if (value.value && !props.range) {
      currentMonth.value = new Date(props.modelValue).getMonth() + 1;
      selectedMonth.value = new Date(props.modelValue).getMonth() + 1;
      currentYear.value = new Date(props.modelValue).getFullYear();
      selectedYear.value = new Date(props.modelValue).getFullYear();
      selectedDay.value = new Date(props.modelValue).getDate();
      selectedQuarter.value = Math.floor(getQuarterByDate(new Date(props.modelValue)));
      selectedHalfYear.value = Math.floor(getHalfYearByDate(new Date(props.modelValue)));
    } else if (props.range && value.value.length === 2) {
      dateRange.value = value.value;
      selectedQuarter.value = Math.floor(getQuarterByDate(new Date(dateRange.value[0])));
      selectedHalfYear.value = Math.floor(getHalfYearByDate(new Date(dateRange.value[0])));
      selectedYear.value = new Date(dateRange.value[0]).getFullYear();
      currentYear.value = new Date(dateRange.value[0]).getFullYear();
      selectedMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
      currentMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
    }

    //// Computed properties
    const isRanged = computed(() => props.range && dateRange.value?.length === 2);
    /**
     * Array of years to select
     * @type {ComputedRef<*[]>}
     */
    const yearsToSelect = computed(() => {
      const years = [];
      for (let year = startYear.value; year <= endYear.value; year++) {
        years.push(year);
      }
      return years;
    });

    /**
     * Get days before 1st day of current month to print
     * @type {ComputedRef<VNode<RendererNode, RendererElement, {[p: string]: any}>[]>}
     */
    const daysBeforeCurrentMonthDays = computed(() => {
      let days = [];
      const prevMonthDate = new Date(selectedYear.value, currentMonth.value - 1, 0).getDate();
      for (let i = 0; i < monthDays.value[0].weekDay - 1; i++) {
        const day = prevMonthDate - i;
        let prevMonth = currentMonth.value - 1;
        let year = selectedYear.value;
        if (prevMonth === 0) {
          year -= 1;
          prevMonth = 12;
        }
        const date = new Date(`${year}-${prevMonth}-${day}`);
        const highlight = props.highlights.find(highlight => compareDays(highlight?.date, date));
        days.unshift({
          number: day,
          date: date,
          highlightClasses: highlight?.class || null,
          tooltipText: highlight?.tooltipText || null,
          isSelected: props.range
            ? dateRange.value.some(rangeDate =>
                compareDays(`${rangeDate.getFullYear()}-${rangeDate.getMonth() + 1}-${rangeDate.getDate()}`, date)
              )
            : day === selectedDay.value && prevMonth === selectedMonth.value && year === selectedYear.value,
        });
      }
      return days.map(day => {
        const allowed = isAllowedDate(new Date(selectedYear.value, (currentMonth.value - 2) % 12, day.number));
        const dayElement = h(
          'div',
          {
            class: ['transition duration-150 w-auto text-center text-gray-900 z-10'],
            onClick: () => {
              if (day.allowed) {
                if (props.range) {
                  setDateRange(day.number, currentMonth.value - 1, selectedYear.value);
                  return;
                }
                setCurrentDateDay(day.number);
              }
            },
          },
          h(
            'div',
            {
              class: [
                'h-8 w-8 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center z-10',
                day?.highlightClasses,
              ],
              style: {
                minWidth: '2rem',
              },
            },
            h(
              'div',
              {
                class: [
                  'w-full h-full flex items-center justify-center rounded-full min-w-full',
                  day.isSelected && 'bg-primary-600 dark:bg-primary-500 text-white',
                ],
              },
              h('span', null, day.number)
            )
          )
        );
        return h(
          'button',
          {
            class: [
              'p-1 h-8 w-auto text-center flex items-center justify-center opacity-50 -mx-0.5',
              !allowed && 'cursor-not-allowed text-gray-300 dark:text-gray-600',
              isRanged.value &&
                checkDateBetweenDateRange(day.date) &&
                'bg-primary-100 dark:bg-primary-500 dark:bg-opacity-30',
              isRanged.value &&
                !compareDays(dateRange.value[0], dateRange.value[1]) &&
                ((compareDays(dateRange.value[0], day.date) && `${rangePointsClasses} after:right-0`) ||
                  (compareDays(dateRange.value[1], day.date) && `${rangePointsClasses} after:left-0`)),
            ],
            onClick: () => (allowed ? setPrevMonthDate(day.number) : null),
          },
          day.tooltipText
            ? h(
                AtTooltip,
                {
                  ...tooltipConfig,
                  body: day.tooltipText,
                },
                {
                  default: () => dayElement,
                }
              )
            : dayElement
        );
      });
    });

    /**
     * Get days after last day of current month to print
     * @type {ComputedRef<VNode<RendererNode, RendererElement, {[p: string]: any}>[]>}
     */
    const daysAfterCurrentMonthDays = computed(() => {
      let days = [];
      for (let i = 0; i < 7 - monthDays.value[monthDays.value.length - 1].weekDay; i++) {
        const day = i + 1;
        let nextMonth = currentMonth.value + 1;
        let year = selectedYear.value;
        if (nextMonth > 12) {
          year += 1;
          nextMonth = 1;
        }
        const date = new Date(`${year}-${nextMonth}-${day}`);
        const highlight = props.highlights.find(highlight => compareDays(highlight?.date, date));
        days.push({
          number: day,
          date: new Date(`${year}-${nextMonth}-${day}`),
          highlightClasses: highlight?.class || null,
          tooltipText: highlight?.tooltipText || null,
          isSelected: props.range
            ? dateRange.value.some(rangeDate =>
                compareDays(`${rangeDate.getFullYear()}-${rangeDate.getMonth() + 1}-${rangeDate.getDate()}`, date)
              )
            : day === selectedDay.value && nextMonth === selectedMonth.value && year === selectedYear.value,
        });
      }
      return days.map(day => {
        let nextMonth = currentMonth.value;
        let yearOfNextMonth = selectedYear.value;
        if (nextMonth > 12) {
          yearOfNextMonth++;
          nextMonth = 1;
        }
        const allowed = isAllowedDate(new Date(yearOfNextMonth, nextMonth, day.number));
        const dayElement = h(
          'div',
          {
            class: ['transition duration-150 w-auto text-center text-gray-900 z-10'],
            onClick: () => {
              if (day.allowed) {
                if (props.range) {
                  setDateRange(day.number, currentMonth.value - 1, selectedYear.value);
                  return;
                }
                setCurrentDateDay(day.number);
              }
            },
          },
          h(
            'div',
            {
              class: [
                'h-8 w-8 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center z-10',
                day?.highlightClasses,
              ],
              style: {
                minWidth: '2rem',
              },
            },
            h(
              'div',
              {
                class: [
                  'w-full h-full flex items-center justify-center rounded-full min-w-full',
                  day.isSelected && 'bg-primary-600 dark:bg-primary-500 text-white',
                ],
              },
              h('span', null, day.number)
            )
          )
        );

        return h(
          'button',
          {
            class: [
              'p-1 h-8 w-auto text-center flex items-center justify-center opacity-50 -mx-0.5',
              !allowed && 'cursor-not-allowed text-gray-300 dark:text-gray-600',
              isRanged.value &&
                checkDateBetweenDateRange(day.date) &&
                'bg-primary-100 dark:bg-primary-500 dark:bg-opacity-30',
              isRanged.value &&
                !compareDays(dateRange.value[0], dateRange.value[1]) &&
                ((compareDays(dateRange.value[0], day.date) && `${rangePointsClasses} after:right-0`) ||
                  (compareDays(dateRange.value[1], day.date) && `${rangePointsClasses} after:left-0`)),
            ],
            onClick: () => (allowed ? setNextMonthDate(day.number) : null),
          },
          day.tooltipText
            ? h(
                AtTooltip,
                {
                  ...tooltipConfig,
                  body: day.tooltipText,
                },
                {
                  default: () => dayElement,
                }
              )
            : dayElement
        );
      });
    });
    /**
     * The title of datepicker
     * @type {ComputedRef<string>}
     */
    const headerTitle = computed(() => {
      const monthName = props.locales[props.locale]?.months.full[currentMonth.value - 1] ?? '';
      return `${capitalize(monthName)} ${selectedYear.value}`;
    });
    //// Computed properties - END

    /**
     * Get Date without time
     * @param {Date} date
     * @returns {Date}
     */
    const getDateWithoutTime = date => {
      const dateWithoutTime = new Date(date);
      dateWithoutTime.setHours(0, 0, 0, 0);
      return dateWithoutTime;
    };

    /**
     * Check if date is allowed
     * @param {Date} date
     * @returns {boolean}
     */
    const isAllowedDate = date => {
      if (props.allowedDates) {
        if (checkType(props.allowedDates, 'array')) {
          return props.allowedDates.some(
            allowedDate => getDateWithoutTime(date).getTime() === getDateWithoutTime(allowedDate).getTime()
          );
        } else if (checkType(props.allowedDates, 'object')) {
          return (
            getDateWithoutTime(props.allowedDates.from).getTime() <= getDateWithoutTime(date).getTime() &&
            getDateWithoutTime(props.allowedDates.to).getTime() >= getDateWithoutTime(date).getTime()
          );
        }
      }
      if (props.disabledDates) {
        if (checkType(props.disabledDates, 'array')) {
          return !props.disabledDates.some(disabledDate => {
            return getDateWithoutTime(date).getTime() === getDateWithoutTime(disabledDate).getTime();
          });
        } else if (checkType(props.disabledDates, 'object')) {
          return (
            getDateWithoutTime(props.disabledDates.from).getTime() > getDateWithoutTime(date).getTime() &&
            getDateWithoutTime(props.disabledDates.to).getTime() < getDateWithoutTime(date).getTime()
          );
        }
      }
      return true;
    };

    //// Watchers
    if (props.range) {
      watch(
        dateRange,
        () => {
          if (dateRange.value.length === 2) {
            if (new Date(dateRange.value[0]) > new Date(dateRange.value[1])) {
              dateRange.value = dateRange.value.reverse();
            }
            emit('update:modelValue', dateRange.value);
          }
        },
        { deep: true }
      );
    } else {
      watch(selectedDay, () => {
        const date = new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value);
        emit('update:modelValue', date);
      });
    }
    watch(
      () => props.highlights,
      () => {
        getCurrentMonthDays();
      }
    );

    //// Watchers - END

    //// Internal handlers
    /**
     * Return the day week number
     * @param {number} date
     * @returns {number|number}
     */
    const getDayOfDate = date => {
      const weekDay = new Date(selectedYear.value, currentMonth.value - 1, date).getDay();
      return weekDay || 7;
    };

    /**
     * Get current month days count
     * @returns {void}
     */
    const getCurrentMonthDays = () => {
      let daysInMonth = new Date(selectedYear.value, currentMonth.value, 0).getDate();
      let days = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(`${selectedYear.value}-${currentMonth.value}-${day}`);
        const highlight = props.highlights.find(
          item =>
            new Date(item?.date).setHours(0, 0, 0, 0) ===
            new Date(`${currentMonth.value}-${day}-${selectedYear.value}`).setHours(0, 0, 0, 0)
        );

        days.push({
          weekDay: getDayOfDate(day),
          number: day,
          date,
          allowed: isAllowedDate(new Date(selectedYear.value, currentMonth.value - 1, day)),
          highlightClasses: highlight?.class || null,
          tooltipText: highlight?.tooltipText || null,
        });
      }

      monthDays.value = days;
    };

    /**
     * Get current years list
     * @returns {Array}
     */
    const getCurrentYearsList = () => {
      const years = [];
      const currentYear = selectedYear.value;
      for (let i = -4; i < 5; i++) {
        const year = currentYear + i;
        const allowed = isAllowedDate(new Date(year, currentMonth.value - 1, 1));
        years.push({ value: year, allowed });
      }
      return years;
    };

    /**
     * Get quarters list
     * @returns {Array}
     */
    const getQuartersList = () => {
      const quarters = [];
      for (let quarter = 1; quarter <= 4; quarter++) {
        const { range: date } = getDateByQuarter(quarter, selectedYear.value);
        const allowed = isAllowedDate(date[0]) && isAllowedDate(date[1]);
        quarters.push({ value: quarter, title: props.locales[props.locale]?.quarters.full[quarter], allowed });
      }
      return quarters;
    };

    /**
     * Get current years list
     * @returns {Array}
     */
    const getHalfYearList = () => {
      const halfYears = [];
      for (let halfYear = 1; halfYear <= 2; halfYear++) {
        const { range: date } = getDateByHalfYear(halfYear, selectedYear.value);
        const allowed = isAllowedDate(date[0]) && isAllowedDate(date[1]);
        halfYears.push({ value: halfYear, title: props.locales[props.locale]?.halfYears.full[halfYear], allowed });
      }
      return halfYears;
    };

    const getPickerButtonClasses = condition => {
      return condition
        ? `bg-primary-600 dark:bg-primary-500 text-white`
        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-900';
    };

    //// Internal handlers - END

    //// External handlers
    /**
     * Previous month days click handler
     * @param {number} day
     */
    const setPrevMonthDate = (day = selectedDay.value) => {
      if (currentMonth.value - 1 === 0) {
        currentMonth.value = 12;
        selectedYear.value--;
      } else {
        currentMonth.value--;
      }
      selectedDay.value = day;
      emit('scroll', new Date(selectedYear.value, currentMonth.value - 1, 1));
      getCurrentMonthDays();
    };

    /**
     * Next month days click handler
     * @param {number} day
     */
    const setNextMonthDate = (day = selectedDay.value) => {
      if (currentMonth.value + 1 === 13) {
        currentMonth.value = 1;
        selectedYear.value++;
      } else {
        currentMonth.value++;
      }
      selectedDay.value = day;
      emit('scroll', new Date(selectedYear.value, currentMonth.value - 1, 1));
      getCurrentMonthDays();
    };

    /**
     * Set current month from month selector
     * @param {number} month
     * @param {boolean} emittable
     */
    const setMonth = (month, emittable = true) => {
      if (currentMonth.value !== month + 1 || currentYear.value !== selectedYear.value) {
        currentMonth.value = month + 1;
        selectedMonth.value = month + 1;
        showMonthYearDropdown.value = false;
        if (props.type === 'date') {
          getCurrentMonthDays();
        }

        if (emittable) {
          if (props.range) {
            emit('update:modelValue', [
              getDateWithoutTime(new Date(selectedYear.value, currentMonth.value - 1, 1)),
              getDateWithoutTime(new Date(selectedYear.value, currentMonth.value, 0)),
            ]);
          } else {
            emit('update:modelValue', new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value));
          }
        }

        emit('scroll', new Date(selectedYear.value, currentMonth.value - 1, 1));
      }
    };

    /**
     * Set current year from year selector
     * @param {number} year
     * @param {boolean} emittable
     */
    const setYear = (year, emittable = true) => {
      if (currentYear.value !== year || selectedYear.value !== year) {
        selectedYear.value = year;
        showMonthYearDropdown.value = false;

        if (props.type === 'date') {
          getCurrentMonthDays();
        }

        if (emittable) {
          if (props.range) {
            emit('update:modelValue', [
              getDateWithoutTime(new Date(selectedYear.value, 0, 1)),
              getDateWithoutTime(new Date(selectedYear.value, 11 + 1, 0)),
            ]);
          } else {
            emit('update:modelValue', new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value));
          }
        }

        emit('scroll', new Date(selectedYear.value, currentMonth.value - 1, 1));
      }
    };

    /**
     * Set current quarter
     * @param {number} quarter
     * @param {boolean} emittable
     */
    const setQuarter = (quarter, emittable = true) => {
      selectedQuarter.value = quarter;

      const { single, range } = getDateByQuarter(quarter, selectedYear.value);
      if (emittable) {
        if (props.range) {
          emit('update:modelValue', [getDateWithoutTime(range[0]), getDateWithoutTime(range[1])]);
        } else {
          emit('update:modelValue', getDateWithoutTime(single));
        }
      }
    };

    /**
     * Set current half year
     * @param {number} halfYear
     * @param {boolean} emittable
     */
    const setHalfYear = (halfYear, emittable = true) => {
      selectedHalfYear.value = halfYear;

      const { single, range } = getDateByHalfYear(halfYear, selectedYear.value);
      if (emittable) {
        if (props.range) {
          emit('update:modelValue', [getDateWithoutTime(range[0]), getDateWithoutTime(range[1])]);
        } else {
          emit('update:modelValue', getDateWithoutTime(single));
        }
      }
    };

    /**
     * Select day
     * @param {Object} day
     */
    const setCurrentDateDay = day => {
      selectedMonth.value = currentMonth.value;
      selectedDay.value = day;
    };

    const setDateRange = (day, month, year) => {
      if (dateRange.value[0] && dateRange.value[1]) {
        dateRange.value = [];
      }
      if (!dateRange.value[0] && !dateRange.value[1]) {
        dateRange.value[0] = new Date(year, month, day);
      } else if (dateRange.value[0] && !dateRange.value[1]) {
        dateRange.value[1] = new Date(year, month, day);
      }
    };

    const checkDateBetweenDateRange = date => {
      const currentDate = new Date(new Date(date).setHours(0, 0, 0, 0));
      const dateFrom = new Date(new Date(dateRange.value[0]).setHours(0, 0, 0, 0));
      const dateTo = new Date(new Date(dateRange.value[1]).setHours(0, 0, 0, 0));

      return currentDate > dateFrom && currentDate < dateTo;
    };

    const compareDays = (firstDay, secondDay) =>
      new Date(firstDay).setHours(0, 0, 0, 0) === new Date(secondDay).setHours(0, 0, 0, 0);

    const renderPickerTemplateByType = () => {
      if (props.type === 'date') {
        return h('div', { class: 'grid grid-cols-7 gap-1 overflow-hidden' }, [
          daysBeforeCurrentMonthDays.value,
          monthDays.value.map(day => {
            const isSelected = props.range
              ? dateRange.value.some(date =>
                  compareDays(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, day.date)
                )
              : day.number === selectedDay.value &&
                selectedMonth.value === currentMonth.value &&
                selectedYear.value === currentYear.value;
            const dayElement = h(
              'div',
              {
                class: ['transition duration-150 w-auto text-center text-gray-900 z-10'],
                onClick: () => {
                  if (day.allowed) {
                    if (props.range) {
                      setDateRange(day.number, currentMonth.value - 1, selectedYear.value);
                      return;
                    }
                    setCurrentDateDay(day.number);
                  }
                },
              },
              h(
                'div',
                {
                  class: [
                    'h-8 w-8 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center z-10 hover:text-gray-900',
                    day?.highlightClasses,
                  ],
                  style: {
                    minWidth: '2rem',
                  },
                },
                h(
                  'div',
                  {
                    class: [
                      'w-full h-full flex items-center justify-center rounded-full min-w-full',
                      isSelected && 'bg-primary-600 dark:bg-primary-500 text-white',
                    ],
                  },
                  h('span', null, day.number)
                )
              )
            );

            return h(
              'button',
              {
                class: [
                  '-mx-0.5 h-8 p-1 flex items-center justify-center scale-100',
                  !day.allowed && 'cursor-not-allowed opacity-40',
                  isRanged.value &&
                    checkDateBetweenDateRange(day.date) &&
                    'bg-primary-100 dark:bg-primary-500 dark:bg-opacity-30',
                  isRanged.value &&
                    !compareDays(dateRange.value[0], dateRange.value[1]) &&
                    ((compareDays(dateRange.value[0], day.date) && `${rangePointsClasses} after:right-0`) ||
                      (compareDays(dateRange.value[1], day.date) && `${rangePointsClasses} after:left-0`)),
                ],
              },
              day.tooltipText
                ? h(
                    AtTooltip,
                    {
                      ...tooltipConfig,
                      body: day.tooltipText,
                    },
                    {
                      default: () => dayElement,
                    }
                  )
                : dayElement
            );
          }),
          daysAfterCurrentMonthDays.value,
        ]);
      }
      if (props.type === 'month') {
        return h('div', { class: 'grid grid-cols-3 gap-1' }, [
          props.locales[props.locale]?.months.full.map((month, index) => {
            const allowed = isAllowedDate(new Date(selectedYear.value, index, 1));

            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-md',
                  allowed
                    ? getPickerButtonClasses(
                        index + 1 === currentMonth.value && selectedYear.value === currentYear.value
                      )
                    : 'cursor-not-allowed text-gray-200 dark:text-gray-500',
                ],
                onClick: () => (allowed ? setMonth(index) : null),
              },
              capitalize(month)
            );
          }),
        ]);
      }
      if (props.type === 'year') {
        const years = getCurrentYearsList();
        return h('div', { class: 'grid grid-cols-3 gap-1' }, [
          years.map(year => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-md',
                  year.allowed
                    ? getPickerButtonClasses(year.value === currentYear.value)
                    : 'cursor-not-allowed text-gray-200 dark:text-gray-500',
                ],
                onClick: () => (year.allowed ? setYear(year.value) : null),
              },
              year.value
            );
          }),
        ]);
      }
      if (props.type === 'quarter') {
        const quarters = getQuartersList();
        return h('div', { class: 'grid grid-cols-2 gap-1' }, [
          quarters.map(quarter => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-full',
                  quarter.allowed
                    ? getPickerButtonClasses(
                        quarter.value === selectedQuarter.value && currentYear.value === selectedYear.value
                      )
                    : 'cursor-not-allowed text-gray-200 dark:text-gray-500',
                ],
                onClick: () => (quarter.allowed ? setQuarter(quarter.value) : null),
              },
              capitalize(quarter.title)
            );
          }),
        ]);
      }
      if (props.type === 'half-year') {
        const halfYears = getHalfYearList();
        return h('div', { class: 'grid grid-cols-2 gap-1' }, [
          halfYears.map(halfYear => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-full',
                  halfYear.allowed
                    ? getPickerButtonClasses(
                        halfYear.value === selectedHalfYear.value && currentYear.value === selectedYear.value
                      )
                    : 'cursor-not-allowed text-gray-200 dark:text-gray-500',
                ],
                onClick: () => (halfYear.allowed ? setHalfYear(halfYear.value) : null),
              },
              capitalize(halfYear.title)
            );
          }),
        ]);
      }
    };
    //// External handles - END

    if (props.type === 'date') {
      getCurrentMonthDays();
    }

    const yearsDropdownRef = ref(null);
    const currentYearRef = ref(null);

    /**
     * Toggle years dropdown and scroll to current year
     * @returns {void}
     */
    const toggleMonthYearDropdown = () => {
      showMonthYearDropdown.value = !showMonthYearDropdown.value;
      nextTick(() => {
        if (yearsDropdownRef.value && showMonthYearDropdown.value && currentYearRef.value) {
          yearsDropdownRef.value.scrollTop = currentYearRef.value.offsetTop - yearsDropdownRef.value.clientHeight / 2;
        }
      });
    };

    return {
      monthDays,
      selectedDay,
      selectedYear,
      currentYear,
      currentMonth,
      headerTitle,
      showMonthYearDropdown,
      yearsToSelect,
      dateRange,
      setMonth,
      setYear,
      setPrevMonthDate,
      setNextMonthDate,
      renderPickerTemplateByType,
      daysBeforeCurrentMonthDays,
      daysAfterCurrentMonthDays,
      setCurrentDateDay,
      yearsDropdownRef,
      currentYearRef,
      toggleMonthYearDropdown,
      rootRefEl,
    };
  },
  render() {
    return h('div', { ref: 'rootRefEl', class: 'block w-full h-full bg-white dark:bg-gray-700 relative' }, [
      h(
        'div',
        {
          class:
            'flex justify-between items-center h-12 border-b-2 border-gray-200 dark:border-gray-500 dark:border-opacity-30 mb-1',
        },
        [
          h(
            'button',
            {
              class:
                'p-2 transition duration-150 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
              onClick: () => {
                if (this.type === 'year') {
                  this.setYear(this.selectedYear - 3, false);
                }
                if (this.type === 'month' || this.type === 'quarter' || this.type === 'half-year') {
                  this.setYear(this.selectedYear - 1, false);
                }
                if (this.type === 'date') {
                  this.setPrevMonthDate();
                }
              },
            },
            [h(ChevronLeftIcon, { class: 'h-5 w-5 text-gray-700 dark:text-gray-300' })]
          ),
          this.type === 'date'
            ? h('div', { class: 'relative' }, [
                h(
                  'button',
                  {
                    class:
                      'transition duration-150 font-semibold hover:bg-gray-100 p-1 px-3 rounded-md dark:text-white dark:hover:bg-gray-800',
                    onClick: () => this.toggleMonthYearDropdown(),
                  },
                  [
                    h('span', { class: 'flex items-center' }, [
                      this.headerTitle,
                      h(ChevronDownIcon, {
                        class: [
                          'transform ease-in-out duration-150 w-5 h-5 ml-1',
                          {
                            'rotate-180': this.showMonthYearDropdown,
                          },
                        ],
                      }),
                    ]),
                  ]
                ),
                h(
                  Transition,
                  {
                    enterActiveClass: 'transition ease-out duration-100',
                    enterFromClass: 'transform opacity-0 scale-95',
                    enterToClass: 'transform opacity-100 scale-100',
                    leaveActiveClass: 'transition ease-in duration-75',
                    leaveFromClass: 'transform opacity-100 scale-100',
                    leaveToClass: 'transform opacity-0 scale-95',
                  },
                  {
                    default: () =>
                      this.showMonthYearDropdown
                        ? h(
                            'div',
                            {
                              class:
                                'transition duration-150 w-full absolute flex justify-center mt-1 py-2 border-2 border-gray-200 dark:border-gray-500 rounded-md bg-white dark:bg-gray-700 shadow-lg mx-auto z-20',
                            },
                            [
                              h('div', { class: 'grid grid-cols-2 items-center justify-center' }, [
                                h(
                                  'div',
                                  {
                                    class:
                                      'max-h-48 overflow-x-hidden overflow-y-auto border-r-2 border-gray-200 dark:border-gray-500 px-2',
                                  },
                                  [
                                    this.locales[this.locale]?.months.short.map((month, index) =>
                                      h(
                                        'button',
                                        {
                                          class: [
                                            'p-0.5',
                                            index + 1 === this.currentMonth
                                              ? `text-primary-600 dark:text-primary-400 font-bold`
                                              : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
                                          ],
                                          onClick: () => this.setMonth(index, false),
                                        },
                                        capitalize(month)
                                      )
                                    ),
                                  ]
                                ),
                                h(
                                  'div',
                                  {
                                    class: 'max-h-48 overflow-x-hidden overflow-y-auto px-2',
                                    ref: 'yearsDropdownRef',
                                  },
                                  [
                                    this.yearsToSelect.map(year =>
                                      h(
                                        'button',
                                        {
                                          ref: year === this.currentYear ? 'currentYearRef' : null,
                                          class: [
                                            'p-0.5',
                                            year === this.selectedYear
                                              ? `text-primary-600 dark:text-primary-400 font-bold`
                                              : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
                                          ],
                                          onClick: () => this.setYear(year, false),
                                        },
                                        year
                                      )
                                    ),
                                  ]
                                ),
                              ]),
                            ]
                          )
                        : null,
                  }
                ),
              ])
            : h(
                'span',
                { class: 'font-semibold p-1 px-3 rounded-md dark:text-white' },
                this.type === 'year' ? this.currentYear : this.selectedYear
              ),

          h(
            'button',
            {
              class:
                'p-2 transition duration-150 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
              onClick: () => {
                if (this.type === 'year') {
                  this.setYear(this.selectedYear + 3, false);
                }
                if (this.type === 'month' || this.type === 'quarter' || this.type === 'half-year') {
                  this.setYear(this.selectedYear + 1, false);
                }
                if (this.type === 'date') {
                  this.setNextMonthDate();
                }
                // this.type !== 'date' ? this.setNextYear() : this.setNextMonthDate();
              },
            },
            [h(ChevronRightIcon, { class: 'h-5 w-5 text-gray-700 dark:text-gray-300' })]
          ),
        ]
      ),

      this.type === 'date'
        ? h('div', { class: 'grid grid-cols-7 gap-1' }, [
            this.locales[this.locale]?.weeks.short.map(weekDay =>
              h('span', { class: 'text-gray-400 dark:text-gray-300 p-2 w-auto text-center' }, weekDay)
            ),
          ])
        : null,
      this.renderPickerTemplateByType(),
    ]);
  },
});
