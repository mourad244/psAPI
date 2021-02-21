import http from "./httpService";

const apiEndpoint = "/services";

function serviceUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getServices() {
  return http.get(apiEndpoint);
}
export function getService(serviceId) {
  return http.get(serviceUrl(serviceId));
}

export async function saveService(service) {
  if (service._id) {
    if (getService(service._id)) {
      const body = { ...service };
      delete body._id;

      return http.put(serviceUrl(service._id), body);
    } else return http.post(apiEndpoint, service);
  }

  return http.post(apiEndpoint, service);
}

export function deleteService(serviceId) {
  return http.delete(serviceUrl(serviceId));
}
