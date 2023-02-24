import { apiClient } from "~/shared/api";
import { AxiosPromise } from "axios";
import { TGetProductsParams, TGetProductsResponse } from "./models";

export const getProductsRequest = (): AxiosPromise<TGetProductsResponse> => {
  return apiClient.get("products");
};

export const searchProductsRequest = (
  params?: TGetProductsParams
): AxiosPromise => {
  return apiClient.get("products/search", { params });
};
