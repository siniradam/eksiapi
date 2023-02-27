import express from "express";
import router from "./router.js";
import { setHeaders } from "./src/utils/response.js";
const app = express();
//CORS, helmet, rate limit...

app.use(setHeaders);
app.use("/v1", router);

app.get("/", (req, res, next) => {
  res.json({ hello: Math.round(Date.now() / 1000) });
});

const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  console.log(`eksi api running on http://localhost:${port}`);
});
