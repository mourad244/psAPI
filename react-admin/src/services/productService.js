import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/products";

function productUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProducts() {
  return http.get(apiEndpoint);
}
export function getProduct(productId) {
  return http.get(productUrl(productId));
}

export async function saveProduct(product) {
  console.log(product);
  if (product._id) {
    if (getProduct(product._id)) {
      const body = { ...product };
      delete body._id;

      return http.put(productUrl(product._id), body);
    } else return http.post(apiEndpoint, product);
  }

  return http.post(apiEndpoint, product);
}

export function deleteProduct(productId) {
  return http.delete(productUrl(productId));
}
