import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function search() {
  return fetch(
    `https://eksisozluk.com/autocomplete/query?q=deprem&_=${Date.now()}`,
    {
      method: "GET",
      headers: {
        "x-requested-with": "XMLHttpRequest",
        "content-type": "application/json",
        Accept: "*/*",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return {};
      }
    })

    .then((json) => console.log(json))
    .catch((err) => console.error(err));
}

export async function getPage(q) {
  q = q.replaceAll(" ", "+");
  const url = `https://eksisozluk.com/?q=${q}`;

  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      console.log({ status: response.status, url });
      if (response.ok) {
        return response.text();
      } else {
        return "";
      }
    })
    .then((result) => {
      return result;
    });
}

//Post parsing;
export async function parseContent(html) {
  if (html == "") return {};

  //
  const $ = cheerio.load(html);

  const today = parseTopicList($, $(".topic-list"));
  const posts = parseBody($, $("#entry-item-list"));
  const pages = parsePages($, $(".sub-title-container"));

  return { today, posts, pages };
}

export function parseTopicList($, htmlObject) {
  //   console.log(html.contents());

  let items = htmlObject
    .children("li")
    .map((i, li) => {
      // console.log($(li));
      let item = $(li).find("a");
      let val = item.text();
      return {
        value: val,
        enc: encodeURI(val.replaceAll(" ", "+")),
      };
    })
    .get()
    .filter((t) => {
      return !!t.value;
    });

  return items;
}

export function parseBody($, htmlObject) {
  let items = htmlObject
    .children("li")
    .map((i, li) => {
      let item = $(li);
      let id = item.data("id");
      return {
        id,
        content: item.children(".content").html().trim(),
        author: item.data("author"),
        author: item.data("author"),
        flags: item.data("flags"),
        isfavorite: item.data("isfavorite"),
        ispinned: item.data("ispinned"),
        ispinnedonprofile: item.data("ispinnedonprofile"),
        favorite: item.data("favorite"),
        seyler: item.data("seyler"),
        comment: item.data("comment"),
        show: item.data("show"),
        link: `https://eksisozluk.com/entry/${id}`,
      };
    })
    .get();

  return items;
}

export function parsePages($, htmlObject) {
  const parent = htmlObject.children(".pager");
  const pageCurrent = parent.data("currentpage");
  const pageTotal = parent.data("pagecount");

  return { pageCurrent, pageTotal };
}

//Profile parsing;
export async function parseProfile(html) {
  if (html == "") return {};
  const $ = cheerio.load(html);

  const upt = $("#user-profile-title");
  const username = upt.data("nick");

  const user = {
    avatar: $("#profile-logo").children("img").attr("href"),
    username,
    thread: upt.children("a").attr("href"),
    stats: {
      entry: $("#entry-count-total").text(),
      followers: $("#user-follower-count").text(),
      following: $("#user-following-count").text(),
    },
    links: {
      favmost: `/en-cok-favorilenen-entryleri?nick=${username}`,
      lastvoted: `/son-oylananlari?nick=${username}`,
      weektop: `/bu-hafta-dikkat-cekenleri?nick=${username}`,
      favuser: `/el-emegi-goz-nuru?nick=${username}`,
      votedmost: `/en-begenilenleri?nick=${username}`,
      favauthors: `/favori-yazarlari?nick=${username}`,
      contributions: `/katkida-bulundugu-kanallar?nick=${username}`,
      requests: `/ukteleri?nick=${username}`,
      problematicpost: `/sorunsallar%C4%B1?nick=${username}`,
      problematicreply: `/sorunsal-yan%C4%B1tlar%C4%B1?nick=${username}`,
    },
  };

  return user;
}

// module.exports = router;

// getPage("6 şubat 2023 deprem yardımlaşma başlığı")
//   .then((p) => parseContent(p))
//   .then((parsed) => console.log(parsed));
