export const getColor = (color, loading = false, disabled = false) => {
  switch (color) {
    case 'primary':
      return `border-transparent text-white ${
        loading || disabled
          ? 'bg-primary-400 text-opacity-90'
          : 'bg-primary-600 hover:bg-primary-500 ' +
            'focus:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ' +
            'dark:bg-primary-500 dark:focus:bg-primary-600 dark:hover:bg-primary-600 dark:focus:ring-offset-gray-900'
      }`;
    case 'secondary':
      return `border-transparent  ${
        loading || disabled
          ? 'text-primary-400 bg-primary-50 dark:bg-primary-400 dark:bg-opacity-20'
          : 'text-primary-700 bg-primary-100 hover:bg-primary-50 focus:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ' +
            'dark:text-primary-300 dark:bg-primary-500 dark:bg-opacity-20 dark:hover:bg-primary-600 dark:hover:bg-opacity-50 dark:focus:bg-primary-400 dark:focus:bg-opacity-20 dark:focus:ring-offset-gray-900'
      }`;
    case 'danger':
      return `border-transparent text-white ${
        loading || disabled
          ? 'bg-red-400'
          : 'bg-red-500 hover:bg-red-400 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-offset-gray-900'
      }`;
    case 'success':
      return `border-transparent text-white ${
        loading || disabled
          ? 'bg-green-400'
          : 'bg-green-500 hover:bg-green-400 focus:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 dark:focus:ring-offset-gray-900'
      }`;
    case 'warning':
      return `border-transparent ${
        loading || disabled
          ? 'text-gray-500 bg-yellow-200'
          : 'text-black bg-yellow-300 hover:bg-yellow-200 focus:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200 dark:focus:ring-offset-gray-900'
      }`;
    case 'white':
      return `border-gray-300 ${
        loading || disabled
          ? 'text-gray-400 bg-gray-50'
          : 'text-gray-700 bg-white hover:text-gray-500 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 dark:focus:ring-offset-gray-900'
      }`;
    default:
      return `border-gray-300 dark:border-gray-600 ${
        loading || disabled
          ? 'text-gray-400 dark:text-gray-200 bg-gray-50 dark:bg-gray-600'
          : 'text-gray-700 bg-white hover:text-gray-500 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ' +
            'dark:text-white dark:bg-gray-700 dark:hover:text-gray-200 dark:hover:bg-opacity-50 dark:focus:bg-opacity-60 dark:focus:ring-offset-gray-900'
      }`;
  }
};
