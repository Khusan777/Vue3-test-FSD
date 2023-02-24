import { h, ref, computed, defineComponent } from 'vue';
import { transformToBool, generatorId, deepCopy, comparisonValues } from '../../utils/';
import AtSteps from '../AtSteps/AtSteps';

export default defineComponent({
  name: 'AtStepsGroup',
  emits: ['update:modelValue'],
  props: {
    disabled: { type: [String, Boolean, Number], default: false },
  },
  setup(props, { slots }) {
    const selected = ref(undefined);
    const steps = ref([]);
    const stepsHash = ref({});
    const stepsConfig = ref([]);
    const selectedHashChildren = ref({});

    const hasDisabled = computed(() => transformToBool(props.disabled));

    function destructSteps() {
      let elements = { list: [], hash: {}, config: [] };
      if ('default' in slots) {
        elements = slots.default().reduce(
          (acc, element) => {
            if (Object.prototype.toString.call(element) === '[object Object]') {
              // Получение инф. о теге
              let tag = undefined;
              if ('tag' in element) {
                tag = element.tag;
              } else {
                if ('props' in element) {
                  tag = element.props;
                }
              }
              // Получение инф. о теге - END
              // Получение аттрибутов
              let attrs = undefined;
              if ('attrs' in element && Object.prototype.toString.call(element.attrs) === '[object Object]') {
                attrs = Object.assign({}, attrs, element.attrs);
              } else {
                if (tag) {
                  if ('title' in tag || 'value' in tag || 'sub-title' in tag || 'subTitle' in tag || 'icon' in tag) {
                    attrs = {};
                  }
                  if ('title' in tag) {
                    attrs['at-step-title'] = tag.title;
                  }
                  if ('value' in tag) {
                    attrs['at-step-value'] = tag.value;
                  }
                  if ('sub-title' in tag) {
                    attrs['at-step-sub-title'] = tag['sub-title'];
                  }
                  if ('subTitle' in tag) {
                    attrs['at-step-sub-title'] = tag.subTitle;
                  }
                  if ('icon' in tag) {
                    attrs['at-step-icon'] = tag.icon;
                  }
                }
              }
              // Получение аттрибутов - END
              if (tag && attrs && 'at-step-title' in attrs) {
                const value = 'at-step-value' in attrs ? attrs['at-step-value'] : generatorId('at-steps-');
                const config = { title: attrs['at-step-title'], value };
                if ('at-step-sub-title' in attrs) {
                  config.subTitle = attrs['at-step-sub-title'];
                }
                if ('at-step-icon' in attrs) {
                  config.icon = attrs['at-step-icon'];
                }
                acc.config.push(config);
                const node = h('div', { class: 'pt-6', 'at-step': true, 'at-step-value': value }, [element]);
                acc.list.push(node);
                acc.hash[value] = node;
              }
            }
            return acc;
          },
          { list: [], hash: {}, config: [] }
        );
      }
      steps.value = elements.list;
      stepsConfig.value = elements.config;

      if (selected.value === undefined && stepsConfig.value.length) {
        selected.value = stepsConfig.value[0].value;
      } else if (selected.value !== undefined) {
        if (selected.value in elements.hash && stepsConfig.value.length) {
          selected.value = stepsConfig.value[0].value;
        }
      }
      stepsHash.value = deepCopy(elements.hash);
      selectedHashChildren.value = deepCopy(stepsHash.value[stepsConfig.value[0].value]);
    }

    destructSteps();

    return {
      steps,
      stepsConfig,
      selected,
      selectedHashChildren,
      stepsHash,
      hasDisabled,
    };
  },
  render() {
    return this.steps.length
      ? h('div', { class: 'block w-full' }, [
          this.stepsConfig.length
            ? h(AtSteps, {
                modelValue: this.selected,
                steps: deepCopy(this.stepsConfig),
                'onUpdate:modelValue': value => {
                  if (this.selected !== value && !this.hasDisabled) {
                    this.selected = value;
                    this.selectedHashChildren = this.stepsHash[this.selected];
                  }
                },
              })
            : null,
          Object.prototype.toString.call(this.stepsHash) === '[object Object]' && this.selected in this.stepsHash
            ? this.selectedHashChildren
            : this.steps.find(step => {
                if (Object.prototype.toString.call(step.attrs) === '[object Object]' && 'attrs' in step) {
                  if (
                    Object.prototype.toString.call(step.attrs) === '[object Object]' &&
                    'at-step-value' in step.attrs
                  ) {
                    return comparisonValues(step.attrs['at-step-value'], this.selected);
                  }
                }
                return false;
              }),
        ])
      : null;
  },
});
