const express = require("express");

const app = express();

const server = app.listen(process.env.HTTP_PORT, () => {
  console.log(`Listening on ${process.env.HTTP_PORT}`);
});
