import express from "express";
import router from "./router.js";
const app = express();
//CORS, helmet, rate limit...

app.use("/v1", router);

const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  console.log(`eksi api running on http://localhost:${port}`);
});
