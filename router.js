import express from "express";
const router = express.Router();

import { search } from "./src/controllers/search.js";
import { thread } from "./src/controllers/thread.js";
import { today } from "./src/controllers/today.js";
import { user } from "./src/controllers/user.js";

router.get("/search/:query", async (req, res, next) => {
  return search(req.params.query).then((result) => res.json(result));
});

router.get("/user/:id/:detail?", async (req, res, next) => {
  return user(req.params.id, req.params.detail).then((result) =>
    res.json(result)
  );
});

router.get("/thread/:title/:page?", async (req, res, next) => {
  return thread(req.params.title, req.params.page).then((result) =>
    res.json(result)
  );
});

router.get("/today/:page?", async (req, res, next) => {
  return today(req.params.page).then((result) => res.json(result));
});

export default router;
