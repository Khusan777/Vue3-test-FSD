import { productModel } from "~/shared/models";

export type TGetProductsParams = Record<string, string | number | boolean>;

export type TGetProductsResponse = {
  limit: number;
  skip: number;
  total: number;
  products: productModel.TProduct[];
};
