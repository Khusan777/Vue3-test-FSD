export const generateSvg = (color, node) => (
  <svg class={['h-5 w-5', color]} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'}>
    {node}
  </svg>
);
