<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useProductDetailStore } from "~/entities/products";
import { useCartsStore } from "~/entities/carts";

const { product } = toRefs(useProductDetailStore());
const { loading, carts } = toRefs(useCartsStore());
const { addToCart } = useCartsStore();

const productInCart = computed(() => {
  return carts.value.some((cart) => cart.id === product.value?.id);
});

const add = () => {
  if (productInCart.value) return;
  if (product.value) {
    addToCart(product.value.id);
  }
};

import AtButton from "~/shared/aliftech-ui/components/AtButton/AtButton";
</script>

<template>
  <AtButton
    block
    color="warning"
    :icon="productInCart ? 'check' : 'shoppingCart'"
    @click="add"
    :loading="loading"
  >
    {{ productInCart ? "In cart" : "Add to cart" }}
  </AtButton>
</template>
