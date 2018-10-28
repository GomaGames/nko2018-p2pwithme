const express = require("express");

const p2pwn = require("../../dist/lib/express-p2pwn");

const app = express();

p2pwn.initialize(app, {
  websocketEndpoint: "ws://localhost:8080",
  entry_url: "http://localhost:3001",
  display_name: "Test Client Host"
});

app.listen(3001);
