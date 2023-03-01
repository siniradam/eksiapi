import * as cheerio from "cheerio";
import { apiRequest } from "../utils/request.js";
import { apiPath, response } from "../utils/response.js";

export async function user(userid, detail) {
  let username = userid.replaceAll(" ", "+");

  if (detail) {
    return response({ message: "Not implemented." });
  }

  const options = {
    endpoint: `/biri/${username}`,
  };

  return apiRequest(options)
    .then((result) => result.text())
    .then((html) => parseProfile(html))
    .then((result) => response(result));
}

export async function parseProfile(html) {
  if (html == "") return {};
  const $ = cheerio.load(html);

  const upt = $("#user-profile-title");
  const username = upt.data("nick");

  const user = {
    avatar: `${$("#profile-logo").children("img").attr("src")}`,
    username,
    thread: upt.children("a").attr("href"),
    stats: {
      entry: $("#entry-count-total").text(),
      followers: $("#user-follower-count").text(),
      following: $("#user-following-count").text(),
    },
    options: {
      favmost: `${apiPath}/user/${username}/favmost`,
      lastvoted: `${apiPath}/user/${username}/lastvoted`,
      weektop: `${apiPath}/user/${username}/weektop`,
      favuser: `${apiPath}/user/${username}/favuser`,
      votedmost: `${apiPath}/user/${username}/votedmost`,
      favauthors: `${apiPath}/user/${username}/favauthors`,
      contributions: `${apiPath}/user/${username}/contributions`,
      requests: `${apiPath}/user/${username}/requests`,
      problematicpost: `${apiPath}/user/${username}/problematicpost`,
      problematicreply: `${apiPath}/user/${username}/problematicreply`,
    },
  };

  return user;
}

// favmost: `/en-cok-favorilenen-entryleri?nick=${username}`,
// lastvoted: `/son-oylananlari?nick=${username}`,
// weektop: `/bu-hafta-dikkat-cekenleri?nick=${username}`,
// favuser: `/el-emegi-goz-nuru?nick=${username}`,
// votedmost: `/en-begenilenleri?nick=${username}`,
// favauthors: `/favori-yazarlari?nick=${username}`,
// contributions: `/katkida-bulundugu-kanallar?nick=${username}`,
// requests: `/ukteleri?nick=${username}`,
// problematicpost: `/sorunsalları?nick=${username}`,
// problematicreply: `/sorunsal-yanıtları?nick=${username}`,
