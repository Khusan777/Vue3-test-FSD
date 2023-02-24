import { h } from 'vue';
import { getClassList } from './methods/getClassList';
import { getIconComponent } from '../../utils';

/**
 * Component body
 * @param {Object} props
 * @param {Object} context
 * @returns {VNode}
 * @constructor
 */
const AtBadge = (props, context) => {
  return h(
    'div',
    Object.assign({}, context.attrs, {
      class: ['inline-flex'].concat(
        'class' in context.attrs ? context.attrs.class : '',
        'staticClass' in context.attrs ? context.attrs.staticClass : ''
      ),
    }),
    [
      h(
        'span',
        {
          class: ['inline-flex items-center py-0.5 font-medium', getClassList(props.rounded, props.large, props.color)],
        },
        [
          props.icon ? h(getIconComponent(props.icon).Icon, { class: ['mr-1', props.large ? 'h-4' : 'h-3.5'] }) : null,
          'default' in context.slots ? context.slots.default() : 'Badge',
        ]
      ),
    ]
  );
};

// Component props
AtBadge.props = {
  color: { type: String, default: '' },
  large: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  icon: { type: [String, Object], default: () => '' },
};

export default AtBadge;
