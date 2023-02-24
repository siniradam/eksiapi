import { getPage, parseContent } from "./api.js";

import express from "express";
// const express = require("express");
const router = express.Router();
const app = express();
//CORS, helmet, rate limit...

router.get("/search/:query", async (req, res, next) => {
  return getPage(req.params.query)
    .then((p) => parseContent(p))
    .then((result) => res.json(result));
});

app.use("/v1", router);

const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  console.log(`eksi api running on http://localhost:${port}`);
});
