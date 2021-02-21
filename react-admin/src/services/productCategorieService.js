import http from "./httpService";

const apiEndpoint = "/productsCategorie";

function productCategorieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProductsCategorie() {
  return http.get(apiEndpoint);
}
export function getProductCategorie(productCategorieId) {
  return http.get(productCategorieUrl(productCategorieId));
}

export async function saveProductCategorie(productCategorie) {
  if (productCategorie._id) {
    if (getProductCategorie(productCategorie._id)) {
      const body = { ...productCategorie };
      delete body._id;
      return http.put(productCategorieUrl(productCategorie._id), body);
    } else return http.post(apiEndpoint, productCategorie);
  }

  return http.post(apiEndpoint, productCategorie);
}

export function deleteProductCategorie(productCategorieId) {
  return http.delete(productCategorieUrl(productCategorieId));
}
