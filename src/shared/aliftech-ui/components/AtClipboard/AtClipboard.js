import { h } from 'vue';

const AtClipboard = (props, context) => {
  return h(
    props.tag,
    Object.assign({}, context.attrs, {
      class: ['cursor-pointer inline-block'].concat('class' in context.attrs ? context.attrs.class : ['']),
      onClick: e => {
        e.stopPropagation();
        if (typeof document !== 'undefined' && 'createElement' in document && 'execCommand' in document) {
          const area = document.createElement('textarea');
          area.style.listStyle = 'position:absolute;left:-999999px;top:-999999px';
          area.innerText = props.value;
          document.body.appendChild(area);
          if ('select' in area) {
            area.select();
            if ('setSelectionRange' in area) {
              area.setSelectionRange(0, props.value.length);
            }
            document.execCommand('copy');
            context.emit('copy');
          }
          document.body.removeChild(area);
        }
      },
    }),
    'default' in context.slots ? context.slots.default() : null
  );
};

AtClipboard.props = {
  tag: { type: String, default: 'div' },
  value: { type: String, required: true },
};

export default AtClipboard;
