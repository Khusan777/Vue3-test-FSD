<script setup lang="ts">
import { toRefs } from "vue";
import { useProductDetailStore } from "~/entities/products";

const { getProduct } = useProductDetailStore();
const { loading, error } = toRefs(useProductDetailStore());

const route = useRoute();

getProduct(+route.params.id);

import { ProductImageSlider } from "~/entities/products";
import { ProductInfo } from "~/entities/products";
import { ProductAddToCart } from "~/features/products";
import { useRoute } from "vue-router";

import AtLoading from "~/shared/aliftech-ui/components/AtLoading/AtLoading";
import AtAlert from "~/shared/aliftech-ui/components/AtAlert/AtAlert";
</script>

<template>
  <div v-if="loading">
    <AtLoading />
  </div>
  <div v-else-if="error">
    <AtAlert type="danger">{{ error }}</AtAlert>
  </div>
  <div v-else class="grid grid-cols-3 gap-5">
    <div class="col-span-1">
      <ProductImageSlider />
    </div>
    <div class="col-span-1">
      <ProductInfo>
        <ProductAddToCart />
      </ProductInfo>
    </div>
  </div>
</template>
