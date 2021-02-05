import http from "./httpService";
import { apiUrl } from "../config.json";

export function getFonctions() {
  return http.get(apiUrl + "/fonctions");
}
