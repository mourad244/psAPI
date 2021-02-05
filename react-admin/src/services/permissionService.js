import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/permissions";

function permissionUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPermissions() {
  return http.get(apiEndpoint);
}
export function getPermission(permissionId) {
  return http.get(permissionUrl(permissionId));
}

export function savePermission(permission) {
  // modifier permission
  if (permission._id) {
    const body = { ...permission };
    delete body._id;

    return http.put(permissionUrl(permission._id), body);
  }
  // ajouter permission
  return http.post(apiEndpoint, permission);
}
export function deletePermission(permissionId) {
  return http.delete(permissionUrl(permissionId));
}
