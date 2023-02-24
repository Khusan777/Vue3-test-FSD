function event(name, inputType = null) {
  const event = document.createEvent('Event');
  event.initEvent(name, true, true);
  if (inputType) {
    event.inputType = inputType;
  }

  return event;
}

function findInputElement(el) {
  return el instanceof HTMLInputElement ? el : el.querySelector('input') || el;
}

function fixInputSelection(el, position, digit) {
  if (position && position < el.value.length && el.value.charAt(position - 1) !== digit) {
    position++;
  } else if (
    (el.value.length !== position && el.value.charAt(position - 1) === digit && el.value.length === 4) ||
    el.value.length === 5 ||
    (el.value.length === 7 && position === 5) ||
    el.value.length === 8 ||
    (el.value.length === 10 && position === 8) ||
    el.value.length === 11 ||
    el.value.length === 12
  ) {
    position++;
  }

  const selectionRange = el.type ? el.type.match(/^(text|search|password|tel|url)$/i) : !el.type;
  if (selectionRange && el === document.activeElement) {
    el.setSelectionRange(position, position);
    setTimeout(function () {
      el.setSelectionRange(position, position);
    }, 0);
  }
}

function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]';
}

export { event, findInputElement, fixInputSelection, isString };
