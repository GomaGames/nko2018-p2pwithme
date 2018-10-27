const express = require("express");

const app = express();

const server = app.listen(process.env.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${process.env.EXPRESS_SERVER_PORT}`);
});
