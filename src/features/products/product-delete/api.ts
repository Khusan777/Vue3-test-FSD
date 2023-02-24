import { apiClient } from "~/shared/api/apiClient";
import { AxiosPromise } from "axios";

export const deleteProductRequest = (id: number): AxiosPromise => {
  return apiClient.delete(`products/${id}`);
};
