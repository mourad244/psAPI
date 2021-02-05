import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/productsType";

function typeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getTypes() {
  return http.get(apiEndpoint);
}
export function getType(typeId) {
  return http.get(typeUrl(typeId));
}

export async function saveType(type) {
  if (type._id) {
    if (getType(type._id)) {
      const body = { ...type };
      delete body._id;

      return http.put(typeUrl(type._id), body);
    } else return http.post(apiEndpoint, type);
  }

  return http.post(apiEndpoint, type);
}

export function deleteType(typeId) {
  return http.delete(typeUrl(typeId));
}
