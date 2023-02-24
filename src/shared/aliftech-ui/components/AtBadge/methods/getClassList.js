export const getClassList = (rounded, large, color) => {
  const result = [
    rounded ? 'rounded-full' : large ? 'rounded-md' : 'rounded',
    large
      ? rounded
        ? 'px-3 text-sm leading-5'
        : 'px-2.5 text-sm leading-5'
      : rounded
      ? 'px-2.5 text-xs leading-4'
      : 'px-2 text-xs leading-4',
  ];
  switch (color) {
    case 'red':
      result.push('bg-red-100 text-red-800 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-400');
      break;
    case 'yellow':
      result.push('bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:bg-opacity-20 dark:text-yellow-400');
      break;
    case 'green':
      result.push('bg-green-100 text-green-800 dark:bg-green-500 dark:bg-opacity-20 dark:text-green-400');
      break;
    case 'blue':
      result.push('bg-blue-100 text-blue-800 dark:bg-blue-500 dark:bg-opacity-20 dark:text-blue-400');
      break;
    case 'indigo':
      result.push('bg-indigo-100 text-indigo-800 dark:bg-indigo-500 dark:bg-opacity-20 dark:text-indigo-400');
      break;
    case 'purple':
      result.push('bg-purple-100 text-purple-800 dark:bg-purple-500 dark:bg-opacity-20 dark:text-purple-400');
      break;
    case 'pink':
      result.push('bg-pink-100 text-pink-800 dark:bg-pink-500 dark:bg-opacity-20 dark:text-pink-400');
      break;
    default:
      result.push('bg-gray-100 text-gray-800 dark:bg-gray-100 dark:bg-opacity-10 dark:text-white');
  }
  return result;
};
