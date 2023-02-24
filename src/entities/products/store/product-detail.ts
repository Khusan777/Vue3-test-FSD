import { defineStore } from "pinia";
import { productModel } from "~/shared/models";
import { getProductRequest } from "../api";

type TState = {
  product: productModel.TProduct | null;
  loading: boolean;
  error: string;
};

export const useProductDetailStore = defineStore("productDetail", {
  state: (): TState => ({
    product: null,
    loading: true,
    error: "",
  }),
  actions: {
    getProduct(id: number) {
      this.loading = true;
      getProductRequest(id)
        .then((response) => {
          this.product = response.data;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
