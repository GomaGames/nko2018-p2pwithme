import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import WebSocket from "ws";

import store from "./store";
import apiRouter from "./api";
import { ClientServerWebSocketMessage, HostRegistrationOffer } from "../types";

const app = express();

app.use(bodyParser({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('lobby', { hosts: store.hosts });
});
app.use("/api", apiRouter);

const server = app.listen(process.env.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${process.env.EXPRESS_SERVER_PORT}`);
});

const wss = new WebSocket.Server({ server });

const connections = new Map();

wss.on("connection", function connection(ws) {
  ws.on("message", buffer => {
    try {
      const data = <ClientServerWebSocketMessage>JSON.parse(buffer.toString());

      switch (data.type) {
        case "REGISTER":
          let payload = <HostRegistrationOffer & ClientServerWebSocketMessage>(
            data
          );

          const host = store.register(payload);
          connections.set(ws, host);
          ws.send(
            JSON.stringify({
              type: "REGISTRATION",
              ...host
            })
          );
      }
    } catch (err) {
      console.error(err.message);
      console.warn(`Error parsing message: ${buffer}`);
      return;
    }
  });
  ws.on("error", err => {
    console.log("ERROR");
    console.log(err);
  });
  ws.on("unexpected-response", (req, res) => {
    console.log("UNEXPECTED RESPONSE");
    console.log(req, res);
  });
  ws.on("close", () => {
    const host = connections.get(ws);
    connections.delete(ws);

    store.unregister(host.access_token);
    console.log("CLOSE");
  });

  ws.once("open", () => {});
});

export default server;
