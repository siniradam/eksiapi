import * as cheerio from "cheerio";
import { apiRequest } from "../utils/request.js";
import { response, apiPath } from "../utils/response.js";

export async function thread(threadTitle, page) {
  let title = encodeURI(threadTitle);

  const options = {
    endpoint: `/${title}`,
  };

  if (page && isFinite(page)) {
    options.query = { p: page };
  }

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

  const posts = parseBody($, $("#entry-item-list"));
  const pages = parsePages($, $(".sub-title-container"), page);

  //   let urlId = page.url.match(/--([0-9]{4,})/);
  //   urlId = urlId ? urlId[1] : "";

  return {
    posts,
    pages,
  };
}

export function parseBody($, htmlObject) {
  let items = htmlObject
    .children("li")
    .map((i, li) => {
      const item = $(li);

      const id = item.data("id");
      const author = item.data("author");
      const author_id = item.data("author-id");
      return {
        id,
        content: item.children(".content").html().trim(),
        author,
        author_id,
        flags: item.data("flags").split(" "),
        isfavorite: item.data("isfavorite"),
        ispinned: item.data("ispinned"),
        ispinnedonprofile: item.data("ispinnedonprofile"),
        favorite: item.data("favorite"),
        seyler: item.data("seyler"),
        comment: item.data("comment"),
        // show: item.data("show"),
        paths: {
          linkPost: `https://eksisozluk.com/entry/${id}`,
          linkAuthor: `https://eksisozluk.com/biri/${author}`.replaceAll(
            " ",
            "-"
          ),
          author: `${apiPath}/user/${author}`.replaceAll(" ", "-"),
        },
      };
    })
    .get();

  return items;
}

export function parsePages($, htmlObject, { url, id }) {
  const parent = htmlObject.children(".pager");
  const pageCurrent = parent ? parent.data("currentpage") : 1;
  const pageTotal = parent ? parent.data("pagecount") : 1;

  let next =
    pageTotal > 1 && pageCurrent < pageTotal ? pageCurrent + 1 : undefined;

  if (next) {
    let newUrl = `${apiPath}/thread/${id}`;
    next = `${newUrl}/${next}`;
  }

  return { pageCurrent, pageTotal, id, next };
}
