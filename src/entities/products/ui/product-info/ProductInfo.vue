<script setup lang="ts">
import { useProductDetailStore } from "~/entities/products";
import { toRefs } from "vue";

const { product } = toRefs(useProductDetailStore());
import AtBadge from "~/shared/aliftech-ui/components/AtBadge/AtBadge";
import { StarIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div v-if="product">
    <h1 class="font-bold text-2xl">{{ product.title }}</h1>
    <div class="mb-2 inline-flex items-center space-x-2">
      <p class="text-sm capitalize">{{ product.category }}</p>
      <span>/</span>
      <AtBadge color="blue" rounded>{{ product.brand }}</AtBadge>
    </div>
    <br />
    <div class="inline-flex items-center space-x-1">
      <StarIcon
        v-for="i in 5"
        :key="i"
        :class="[
          i < product.rating ? 'text-yellow-500' : 'text-gray-300',
          'h-6 w-6',
        ]"
      />
    </div>
    <h2 class="font-bold text-xl mb-4">{{ product.price }}$</h2>
    <p>
      {{ product.description }}
    </p>
    <div class="my-4">
      <slot></slot>
    </div>
  </div>
</template>
