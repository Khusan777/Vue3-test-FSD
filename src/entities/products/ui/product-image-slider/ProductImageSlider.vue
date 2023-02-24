<script setup lang="ts">
import { toRefs } from "vue";
import { useProductDetailStore } from "~/entities/products";

const { product } = toRefs(useProductDetailStore());

import Flicking from "@egjs/vue3-flicking";
</script>

<template>
  <Flicking :options="{ align: 'prev', circular: true }" v-if="product?.images">
    <img
      class="w-full max-h-80 h-full object-contain"
      v-for="(image, i) in product.images"
      :key="i"
      :src="image"
      alt="Image"
    />
  </Flicking>
</template>
