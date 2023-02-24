import { h } from 'vue';

function renderSkeleton(context) {
  return h('div', { class: ['animate-pulse'] }, [
    h('div', {
      class: [].concat('class' in context.attrs ? context.attrs.class : ''),
      style: Object.assign({}, 'style' in context.attrs ? context.attrs.style : {}),
    }),
  ]);
}

const AtSkeleton = (props, context) => {
  let skeletonClass = [];
  switch (props.type) {
    case 'row':
      skeletonClass = ['h-4 bg-gray-200 rounded dark:bg-gray-700'];
      break;
    case 'label':
      skeletonClass = ['h-4 w-32 bg-gray-200 rounded dark:bg-gray-700'];
      break;
    case 'avatar':
      skeletonClass = ['bg-gray-200 rounded-full h-12 w-12 dark:bg-gray-700'];
      break;
    case 'button':
      skeletonClass = ['h-8 w-32 bg-gray-200 rounded dark:bg-gray-700'];
      break;
    case 'image':
      skeletonClass = ['h-48 w-full bg-gray-200 rounded dark:bg-gray-700'];
      break;
    default:
      skeletonClass = ['h-8 bg-gray-200 rounded dark:bg-gray-700'];
      break;
  }
  if (props.type === 'input-with-label' || props.type === 'textarea-with-label') {
    return h('div', { class: ['block'] }, [
      renderSkeleton(
        Object.assign({}, context, {
          attrs: Object.assign({}, context.attrs, {
            class: 'bg-gray-200 rounded mb-2 dark:bg-gray-700',
            style: Object.assign({}, 'style' in context.attrs ? context.attrs.style : {}, {
              height: 23 / 16 + 'rem',
              maxWidth: 170 / 16 + 'rem',
            }),
          }),
        })
      ),
      renderSkeleton(
        Object.assign({}, context, {
          attrs: Object.assign({}, context.attrs, {
            class: 'bg-gray-200 rounded mb-0 dark:bg-gray-700',
            style: {
              height: props.type === 'input-with-label' ? 39 / 16 + 'rem' : 64 / 16 + 'rem',
            },
          }),
        })
      ),
    ]);
  }
  if (props.type === 'checkbox' || props.type === 'checkbox-with-description') {
    return h('div', { class: ['block'] }, [
      h('div', { class: 'flex flex-wrap' }, [
        renderSkeleton(
          Object.assign({}, context, {
            attrs: Object.assign({}, context.attrs, {
              class: 'bg-gray-200 rounded mb-0 dark:bg-gray-700',
              style: {
                height: 16 / 16 + 'rem',
                maxWidth: 16 / 16 + 'rem',
                width: 16 / 16 + 'rem',
              },
            }),
          })
        ),
        h('div', { class: 'flex-1 ml-3' }, [
          renderSkeleton(
            Object.assign({}, context, {
              attrs: Object.assign({}, context.attrs, {
                class: 'bg-gray-200 rounded mb-0 dark:bg-gray-700',
                style: {
                  height: 17 / 16 + 'rem',
                  maxWidth: 160 / 16 + 'rem',
                },
              }),
            })
          ),
          props.type === 'checkbox-with-description'
            ? renderSkeleton(
                Object.assign({}, context, {
                  attrs: Object.assign({}, context.attrs, {
                    class: 'bg-gray-200 rounded mb-0 dark:bg-gray-700',
                    style: {
                      height: 16 / 16 + 'rem',
                      marginTop: 7 / 16 + 'rem',
                    },
                  }),
                })
              )
            : null,
        ]),
      ]),
    ]);
  }
  return renderSkeleton(
    Object.assign({}, context, {
      attrs: Object.assign({}, context.attrs, {
        class: [].concat(skeletonClass, 'class' in context.attrs ? context.attrs.class : ''),
      }),
    })
  );
};

AtSkeleton.props = {
  type: { type: String, default: 'input' },
};

export default AtSkeleton;
