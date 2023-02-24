<template>
  <div class="space-y-10">
    <ProductsFilters></ProductsFilters>
    <ProductsList></ProductsList>
  </div>
</template>

<script setup lang="ts">
import { ProductsFilters } from "~/features/products";
import ProductsList from "~/widgets/products";
</script>
