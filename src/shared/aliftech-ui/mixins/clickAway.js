export default {
  methods: {
    $_At_callbackClickAway(e) {
      this.$nextTick(() => {
        const el = this?.$el ?? undefined;
        if (el !== undefined) {
          const path = e?.path || (e?.composedPath ? e?.composedPath() : undefined);
          if (path ? path.indexOf(el) < 0 : !el.contains(e.target)) {
            return this?.$_At_clickAway?.(e);
          }
        }
      });
    },
  },
  created() {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.$_At_callbackClickAway, false);
    }
  },
  beforeDestroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.$_At_callbackClickAway, false);
    }
  },
};
