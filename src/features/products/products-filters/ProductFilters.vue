<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const q = ref<string>("");
const router = useRouter();
const route = useRoute();

watch(q, () => {
  router.replace({
    ...route,
    query: q.value ? { q: q.value } : {},
  });
});

import AtInput from "~/shared/aliftech-ui/components/AtInput/AtInput.js";
</script>

<template>
  <form>
    <AtInput v-model="q" icon-before="search" />
  </form>
</template>
