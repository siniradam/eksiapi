import { apiRequest } from "../utils/request.js";
import { response } from "../utils/response.js";

export async function search(searchParameter) {
  const options = {
    endpoint: "/autocomplete/query",
    query: {
      q: encodeURI(searchParameter.replaceAll(" ", "+")),
    },
  };

  return apiRequest(options)
    .then((result) => result.json())
    .then((result) => response(result));
}
