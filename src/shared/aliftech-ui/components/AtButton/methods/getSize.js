export const getSize = size => {
  switch (size) {
    case 'xs':
      return 'px-2.5 py-1.5 text-xs leading-4';
    case 'sm':
      return 'px-3 py-2 text-sm leading-4';
    case 'md':
      return 'px-4 py-2 text-sm leading-5';
    case 'lg':
      return 'px-4 py-2 text-base leading-6';
    default:
      return 'px-4 py-2 text-sm leading-5';
  }
};
