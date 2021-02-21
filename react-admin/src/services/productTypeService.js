import http from "./httpService";

const apiEndpoint = "/productsType";

function productTypeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProductsType() {
  return http.get(apiEndpoint);
}
export function getProductType(productTypeId) {
  return http.get(productTypeUrl(productTypeId));
}

export async function saveProductType(productType) {
  if (productType._id) {
    if (getProductType(productType._id)) {
      const body = { ...productType };
      delete body._id;

      return http.put(productTypeUrl(productType._id), body);
    } else return http.post(apiEndpoint, productType);
  }

  return http.post(apiEndpoint, productType);
}

export function deleteProductType(productTypeId) {
  return http.delete(productTypeUrl(productTypeId));
}
