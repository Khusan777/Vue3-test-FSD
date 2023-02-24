import { h } from 'vue';

const AtStep = (props, context) => {
  return props.title
    ? h(
        'div',
        Object.assign(
          {
            class: ['block dark:text-gray-200'].concat(
              'class' in context.attrs ? context.attrs.class : '',
              'staticClass' in context.attrs ? context.attrs.staticClass : ''
            ),
          },
          context.attrs,
          Object.assign(
            {},
            'attrs' in context ? context.attrs : {},
            { 'at-step-title': props.title },
            props.subTitle ? { 'at-step-sub-title': props.subTitle } : {},
            props.value ? { 'at-step-value': props.value } : {},
            props.icon ? { 'at-step-icon': props.icon } : {}
          )
        ),
        'default' in context.slots
          ? context.slots.default({
              title: props.title,
              subTitle: props.subTitle,
              value: props.value,
              icon: props.icon,
            })
          : null
      )
    : null;
};

AtStep.props = {
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
};

export default AtStep;
