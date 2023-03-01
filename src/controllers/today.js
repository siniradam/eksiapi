import * as cheerio from "cheerio";
import { apiRequest } from "../utils/request.js";
import { response, apiPath } from "../utils/response.js";

export async function today(page) {
  const options = {
    endpoint: `/`,
  };

  return apiRequest(options)
    .then(async (result) => {
      return {
        html: await result.text(),
        url: result.url,
      };
    })
    .then(({ html, url }) =>
      parsePage(html, {
        url: url,
        id: url.split("/")[3].split("?")[0],
      })
    )
    .then((result) => response(result));
}

function parsePage(html, page) {
  if (html == "") return {};

  const $ = cheerio.load(html);

  const today = parseTopicList($, $(".topic-list"));

  return {
    today,
  };
}

export function parseTopicList($, htmlObject) {
  let items = htmlObject
    .children("li")
    .map((i, li) => {
      let item = $(li).find("a");
      let val = item.text();
      let url = `${item.attr("href")}`;
      url = url.split("?")[0];
      let id = url.split("--")[1];
      return {
        id,
        value: val,
        path: `${apiPath}/thread${url}`,
        pathencoded: `${apiPath}/thread/${encodeURI(val)}`,
        encoded: encodeURI(val),
      };
    })
    .get()
    .filter((t) => {
      return !!t.value;
    });

  return items;
}
