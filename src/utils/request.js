import fetch from "node-fetch";

const API_URL = `https://eksisozluk.com`;

const DEFAULT_HEADERS = {
  "x-requested-with": "XMLHttpRequest",
  "content-type": "application/json",
  Accept: "*/*",
};

export async function apiRequest({ endpoint, query, post }) {
  let url = `${API_URL}${endpoint ? endpoint : ""}`;

  let q =
    query && typeof query == "object"
      ? { ...query, _: Date.now() }
      : { _: Date.now() };

  const options = {
    method: "GET",
    headers: { ...DEFAULT_HEADERS },
  };

  if (post) {
    options.method = "POST";
    options.body = JSON.stringify({ ...post });
  }

  url += "?" + new URLSearchParams(q).toString();

  return fetch(url, options);
  // .then((response) => {
  //   return response.ok ? response:{}
  //   if () {
  //     // return response.json();
  //     // return response.text();
  //   } else {
  //     return "";
  //   }
  // })
  // .catch((err) => {
  //   console.log(err);
  //   return "";
  // });
}

export const extractMeta = (html) => {
  const regex = /<meta property="(.*?)" content="(.*?)">/gm;
  const meta = {};
  for (const match of html.matchAll(regex)) {
    meta[match[1]] = match[2];
  }
  return meta;
};
