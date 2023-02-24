<script setup lang="ts">
import { defineProps } from "vue";
import { productModel } from "~/shared/models";

defineProps<{
  product: productModel.TProduct;
}>();

import AtPanel from "~/shared/aliftech-ui/components/AtPanel/AtPanel.js";
import AtBadge from "~/shared/aliftech-ui/components/AtBadge/AtBadge.js";
</script>

<template>
  <router-link
    :to="{ name: 'products-detail', params: { id: product.id } }"
    :key="product.id"
  >
    <AtPanel class="hover:scale-105 transition duration-150 hover:shadow-lg">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="h-40 w-full object-contain mb-2"
      />
      <h5 class="font-semibold">{{ product.title }}</h5>
      <div class="mb-2">
        <AtBadge color="blue">{{ product.category }}</AtBadge>
      </div>
      <p class="mb-2">{{ product.price }}$</p>
      <slot name="actions"></slot>
    </AtPanel>
  </router-link>
</template>
