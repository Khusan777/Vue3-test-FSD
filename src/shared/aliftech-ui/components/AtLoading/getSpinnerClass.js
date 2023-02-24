export const getSpinnerClass = (color, size) => {
  let textColor;
  let hw = 'h-5 w-5';

  switch (color) {
    case 'primary':
    case 'success':
    case 'danger':
      textColor = 'text-white';
      break;
    case 'secondary':
      textColor = 'text-primary-700';
      break;
    case 'warning':
      textColor = 'text-black';
      break;
    default:
      textColor = 'text-gray-700 dark:text-primary-400';
      break;
  }

  if (size === 'xs' || size === 'sm') {
    hw = 'h-4 w-4 ';
  }

  return textColor + ' ' + hw;
};
