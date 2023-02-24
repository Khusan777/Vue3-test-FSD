import { apiClient } from "~/shared/api/apiClient";
import { AxiosPromise } from "axios";

export const addToCartRequest = (productId: number): AxiosPromise => {
  return apiClient.post("carts/add", {
    userId: 1,
    products: [{ id: productId, quantity: 1 }],
  });
};
