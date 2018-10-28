const express = require("express");

const p2pwn = require("../../dist/lib/express-p2pwn");

const app = express();

p2pwn.initialize(app, {
  port: 3001,
  display_name: "Test Client Host"
});

app.listen(3001);
