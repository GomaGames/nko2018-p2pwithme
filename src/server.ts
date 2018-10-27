import * as express from "express";

import apiRouter from "./api";

const app = express();

app.use("/api", apiRouter);

const server = app.listen(process.env.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${process.env.EXPRESS_SERVER_PORT}`);
});

export default server;
