const background = ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'].reduce((acc, bg) => {
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(opacity => (acc['bg-' + bg + '-' + opacity] = true));
  return acc;
}, {});

export default {
  'bg-transparent': true,
  'bg-current': true,
  'bg-black': true,
  'bg-white': true,
  ...background,
};
