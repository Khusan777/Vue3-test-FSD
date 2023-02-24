import { AxiosPromise } from "axios";
import { productModel } from "~/shared/models";
import { apiClient } from "~/shared/api";

export const getProductRequest = (
  id: number
): AxiosPromise<productModel.TProduct> => {
  return apiClient.get(`products/${id}`);
};
