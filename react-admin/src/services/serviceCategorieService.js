import http from "./httpService";

const apiEndpoint = "/servicescategorie";

function serviceCategorieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getServicesCategorie() {
  return http.get(apiEndpoint);
}
export function getServiceCategorie(serviceCategorieId) {
  return http.get(serviceCategorieUrl(serviceCategorieId));
}

export async function saveServiceCategorie(serviceCategorie) {
  if (serviceCategorie._id) {
    if (getServiceCategorie(serviceCategorie._id)) {
      const body = { ...serviceCategorie };
      delete body._id;

      return http.put(serviceCategorieUrl(serviceCategorie._id), body);
    } else return http.post(apiEndpoint, serviceCategorie);
  }

  return http.post(apiEndpoint, serviceCategorie);
}

export function deleteServiceCategorie(serviceCategorieId) {
  return http.delete(serviceCategorieUrl(serviceCategorieId));
}
