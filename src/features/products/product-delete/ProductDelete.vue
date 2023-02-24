<script setup lang="ts">
import { defineProps, ref, defineEmits } from "vue";
import { deleteProductRequest } from "./api";

const props = defineProps<{ id: number }>();
const emit = defineEmits<{
  (e: "delete"): void;
}>();

const loading = ref<boolean>(false);
const deleteError = ref<boolean>(false);

const deleteProduct = () => {
  loading.value = true;
  deleteProductRequest(props.id)
    .then(() => {
      emit("delete");
    })
    .catch((error) => {
      deleteError.value = error;
    })
    .finally(() => {
      loading.value = false;
    });
};

import AtButton from "~/shared/aliftech-ui/components/AtButton/AtButton.js";
</script>

<template>
  <AtButton
    @click="deleteProduct"
    block
    color="danger"
    size="sm"
    :loading="loading"
    :disabled="loading"
  >
    Delete product
  </AtButton>
</template>
