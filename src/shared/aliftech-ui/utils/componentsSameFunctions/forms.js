export const setInputBorderClass = (error, success) => {
  if (error) {
    return [
      'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
      'dark:border-red-500 dark:text-red-500 dark:placeholder-red-400 dark:focus:ring-red-600 dark:focus:border-red-600',
    ];
  } else if (success) {
    return [
      'border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500',
      'dark:border-green-500 dark:text-green-500 dark:placeholder-green-400 dark:focus:ring-green-600 dark:focus:border-green-600',
    ];
  } else {
    return [
      `text-gray-700 placeholder-gray-600 focus:ring-primary-500 focus:border-primary-500 border-gray-300`,
      `dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-600 dark:focus:border-primary-600 dark:border-gray-600`,
    ];
  }
};

export const getInputHelpType = (error, success) => {
  if (error) {
    return 'error';
  } else if (success) {
    return 'success';
  } else {
    return 'muted';
  }
};
