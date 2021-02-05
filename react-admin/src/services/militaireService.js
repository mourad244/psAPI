import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/militaires";

function militaireUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMilitaires() {
  return http.get(apiEndpoint);
}
export function getMilitaire(militaireId) {
  return http.get(militaireUrl(militaireId));
}

export async function saveMilitaire(militaire) {
  if (militaire._id) {
    if (getMilitaire(militaire._id)) {
      const body = { ...militaire };
      delete body._id;

      return http.put(militaireUrl(militaire._id), body);
    } else return http.post(apiEndpoint, militaire);
  }

  return http.post(apiEndpoint, militaire);
}

export function deleteMilitaire(militaireId) {
  return http.delete(militaireUrl(militaireId));
}
