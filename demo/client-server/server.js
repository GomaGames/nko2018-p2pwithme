const express = require("express");

const p2pwn = require("../../dist/lib/express-p2pwn");

const app = express();

const agent = p2pwn.initialize(app, {
  websocketEndpoint: "ws://localhost:8080",
  entry_url: "http://localhost:3001",
  display_name: "Test Client Host"
});

console.debug("Updating the entry URL in 5 seconds");
setTimeout(() => {
  agent.setState({ entry_url: "http://localhost:3001/join" });
}, 5000);

app.listen(3001);
