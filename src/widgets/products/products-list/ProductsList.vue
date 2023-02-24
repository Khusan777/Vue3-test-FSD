<script setup lang="ts">
import { productModel } from "~/shared/models";
import { productsApi } from "./api";
import { ref, watch } from "vue";

const loading = ref<boolean>(true);
const products = ref<productModel.TProduct[]>([]);
const productsError = ref<string>();
const route = useRoute();

watch(
  () => route.query,
  () => {
    if (!Object.keys(route.query).length) {
      getProducts();
    } else {
      searchProducts();
    }
  }
);

const searchProducts = () => {
  loading.value = true;
  productsApi
    .searchProductsRequest(route.query as productModel.TGetProductsParams)
    .then((response) => {
      products.value = response.data.products;
    })
    .catch((error) => {
      productsError.value = error;
    })
    .finally(() => {
      loading.value = false;
    });
};

const getProducts = () => {
  loading.value = true;
  productsApi
    .getProductsRequest()
    .then((response) => {
      products.value = response.data.products;
    })
    .catch((error) => {
      productsError.value = error;
    })
    .finally(() => {
      loading.value = false;
    });
};

getProducts();

import AtLoading from "~/shared/aliftech-ui/components/AtLoading/AtLoading.js";
import AtAlert from "~/shared/aliftech-ui/components/AtAlert/AtAlert.js";
import { ProductCard } from "~/entities/products";
import { ProductDelete } from "~/features/products";
import { useRoute } from "vue-router";
</script>

<template>
  <div v-if="loading">
    <AtLoading />
  </div>
  <div v-else-if="productsError">
    <AtAlert type="danger">{{ productsError }}</AtAlert>
  </div>
  <div v-else>
    <div class="grid grid-cols-4 gap-5">
      <div v-for="product in products" :key="product.id">
        <ProductCard :product="product">
          <template #actions>
            <ProductDelete :id="product.id" />
          </template>
        </ProductCard>
      </div>
    </div>
  </div>
</template>
