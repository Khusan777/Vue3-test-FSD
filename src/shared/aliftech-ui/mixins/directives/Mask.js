const tokens = {
  '#': { pattern: /\d/ },
  X: { pattern: /[0-9a-zA-Z]/ },
  S: { pattern: /[a-zA-Z]/ },
  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
  '!': { escape: true },
};

function maskit(value, mask, masked = true, tokens) {
  value = value || '';
  mask = mask || '';
  let iMask = 0;
  let iValue = 0;
  let output = '';
  while (iMask < mask.length && iValue < value.length) {
    let cMask = mask[iMask];
    const masker = tokens[cMask];
    const cValue = value[iValue];
    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue;
        iMask++;
      }
      iValue++;
    } else {
      if (masker && masker.escape) {
        iMask++;
        cMask = mask[iMask];
      }
      if (masked) output += cMask;
      if (cValue === cMask) iValue++;
      iMask++;
    }
  }
  let restOutput = '';
  while (iMask < mask.length && masked) {
    const cMask = mask[iMask];
    if (tokens[cMask]) {
      restOutput = '';
      break;
    }
    restOutput += cMask;
    iMask++;
  }
  return output + restOutput;
}

function dynamicMask(maskit, masks, tokens) {
  masks = masks.sort((a, b) => a.length - b.length);
  return function (value, mask, masked = true) {
    let i = 0;
    while (i < masks.length) {
      const currentMask = masks[i];
      i++;
      const nextMask = masks[i];
      if (!(nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length)) {
        return maskit(value, currentMask, masked, tokens);
      }
    }
    return '';
  };
}

function masker(value, mask, masked = true, tokens) {
  return Array.isArray(mask)
    ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens)
    : maskit(value, mask, masked, tokens);
}

function generateEvent(name) {
  if (typeof document !== 'undefined') {
    try {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      return event;
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

const directive = {
  beforeMount: (el, binding) => {
    const input = generateEvent('input');
    if (input !== undefined) {
      let config = binding.value;
      if (Array.isArray(config) || typeof config === 'string') {
        config = {
          mask: config,
          tokens: tokens,
        };
      }
      if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
        const els = el.getElementsByTagName('input');
        if (els.length !== 1) {
          throw new Error('v-mask directive requires 1 input, found ' + els.length);
        } else {
          el = els[0];
        }
      }
      el.oninput = function (evt) {
        const event = generateEvent('input');
        if (event !== undefined) {
          if (!evt.isTrusted) return;
          let position = el.selectionEnd;
          const digit = el.value[position - 1];
          el.value = masker(el.value, config.mask, true, config.tokens);
          while (position < el.value.length && el.value.charAt(position - 1) !== digit) {
            position++;
          }
          if (el === document.activeElement) {
            el.setSelectionRange(position, position);
            setTimeout(function () {
              el.setSelectionRange(position, position);
            }, 0);
          }
          el.dispatchEvent(event);
        }
      };
      const newDisplay = masker(el.value, config.mask, true, config.tokens);
      if (newDisplay !== el.value) {
        el.value = newDisplay;
        el.dispatchEvent(input);
      }
    }
  },
};

export { tokens, directive, masker };
