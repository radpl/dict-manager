import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.REACT_APP_API_URL + "/dictionaries/";

export function getDictionaries() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function saveDictionary(dictionary) {
  return fetch(baseUrl + (dictionary.id || ""), {
    method: dictionary.id ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dictionary)
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteDictionary(dictionaryId) {
  return fetch(baseUrl + dictionaryId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}