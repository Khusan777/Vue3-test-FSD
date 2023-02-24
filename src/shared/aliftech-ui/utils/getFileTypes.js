import { checkType } from './checkType';
import { hasOwnProperty } from './hasOwnProperty';
import { callbackIterableArray } from './callbackIterableArray';
import { callbackIterableObject } from './callbackIterableObject';
import { mimes } from '../constants/mimes';

export const getFileTypes = mime => {
  const types = new Set();
  const clearMime = new Set();
  const parser = (el, container, mimeContainer) => {
    if (checkType(el, 'string')) {
      el.split(',').forEach(type => {
        const str = type.trim();
        switch (str.includes('/') ? 'type' : str.includes('.') ? 'expansion' : '') {
          case 'type':
            {
              if (hasOwnProperty(mimes.types, str)) {
                container.add(mimes.types[str]);
                mimeContainer.add(str);
              }
            }
            break;
          case 'expansion': {
            if (hasOwnProperty(mimes.expansion, str)) {
              container.add(mimes.expansion[str]);
              mimeContainer.add(str);
            }
          }
        }
      });
    }

    if (checkType(el, 'array')) {
      callbackIterableArray(el, item => parser(item, container));
    }

    if (checkType(el, 'object')) {
      callbackIterableObject(el, (show, item) => (!show ? null : parser(item, container)));
    }
  };

  parser(mime, types, clearMime);

  const text = Array.from(types).join(', ');
  return {
    text: Array.from(types).join(', '),
    mime: Array.from(clearMime).join(', '),
    hash: text.split(', ').reduce((acc, el) => {
      acc[el] = true;
      return acc;
    }, {}),
  };
};
