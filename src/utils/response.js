export function setHeaders(req, res, next) {
  res.setHeader("Powered", "Yep!");
  res.setHeader("X-nananana", "Batman!");
  res.setHeader("X-Powered-By", "OhShift");
  res.setHeader(
    "X-hacker",
    "This is a proof of concept, please don't push it."
  );
  res.setHeader("X-GitHub-Repo", "https://github.com/siniradam/eksiapi");

  next();
}

export async function response(data, status) {
  return {
    status: !status || status == 200,
    time: Math.floor(Date.now() / 1000),
    data,
  };
}

export const apiPath = "/v1";
