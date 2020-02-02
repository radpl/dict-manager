import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.REACT_APP_API_URL + "/entries";

export function getEntries(dictId) {
  return fetch(baseUrl + "?dictId=" + dictId)
    .then(handleResponse)
    .catch(handleError);
}

export function saveEntry(entry) {
  return fetch(baseUrl + "/" + (entry.id || ""), {
    method: entry.id ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(entry)
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveBulkEntries(entries) {
  return fetch(baseUrl + "/bulk", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(entries)
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteEntry(entryId) {
  return fetch(baseUrl + "/" + entryId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}
