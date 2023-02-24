export default function useGeneratePages() {
  const generatePages = (from, end) => {
    const range = (from, to, callback = () => null) => {
      const range = [];
      from = from > 0 ? from : 1;
      let index = 0;
      for (let i = from; i <= to; i++) {
        range.push(callback(i, index++, to));
      }
      return range;
    };
    if (end === 1) {
      return [{ page: 1, hidden: false }];
    }
    if (end < 6) {
      return range(1, end, page => ({ page, hidden: false }));
    }
    const even = end % 2 === 0 ? 1 : 0;
    const left = Math.min(Math.floor(end / 2), 3);
    const right = end - left + 1 + even;
    if (from > left && from < right) {
      const start = from - left + 2;
      const _end = from + left - 1 - even;
      return [
        { page: 1, hidden: true },
        { title: '...', page: 2, hidden: false },
      ].concat(
        range(start, _end, page => ({ page, hidden: false })),
        [
          { title: '...', page: Math.max(1, end - 1), hidden: false },
          { page: end, hidden: true },
        ]
      );
    } else if (from === left) {
      const _end = from + left - even;
      return range(1, _end, (page, index, total) => ({
        page,
        hidden: index === 0 || page === total,
      })).concat([
        { title: '...', page: Math.max(1, end - 1), hidden: false },
        { page: end, hidden: false },
      ]);
    } else if (from === right) {
      return [
        { page: 1, hidden: false },
        { title: '...', page: 2, hidden: false },
      ].concat(
        range(Math.min(from - 1, from - 3), end, (page, index) => ({
          page,
          hidden: index === 0 || index === 1,
        }))
      );
    } else {
      const prev = range(1, left, (page, index, total) => ({
        page,
        hidden: total === page,
      }));
      const prevLast = prev[prev.length - 1] !== undefined ? prev[prev.length - 1].page : 0;
      return prev.concat(
        [{ title: '...', page: prevLast + 1, hidden: false }],
        prevLast > 0
          ? range(Math.max(prevLast + 1, end - 2), end, (page, index) => ({
              page,
              hidden: index === 0,
            }))
          : []
      );
    }
  };

  return { generatePages };
}
