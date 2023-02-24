import { defineStore } from "pinia";
import { addToCartRequest } from "./api";

type TState = {
  carts: any;
  loading: boolean;
  error: string;
};

export const useCartsStore = defineStore("carts", {
  state: (): TState => ({
    loading: false,
    error: "",
    carts: [],
  }),
  actions: {
    addToCart(productId: number) {
      this.loading = true;
      addToCartRequest(productId)
        .then(() => {
          this.carts.push({ id: productId, quantity: 1 });
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
