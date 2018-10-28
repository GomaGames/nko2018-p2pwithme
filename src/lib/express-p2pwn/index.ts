import localtunnel from "localtunnel";
import WebSocket from "ws";
import { Application } from "express";

import { HostRegistrationOffer } from "../../../types";

import {
  ClientServerWebSocketMessage,
  ClientHost,
  RegisterEvent
} from "../../../types";

type AgentOptions = {
  websocketEndpoint: string;
} & HostRegistrationOffer;

class P2PwnAgent {
  private socket: WebSocket;
  public readonly createdAt: Date | number;

  constructor(options: AgentOptions) {
    this.createdAt = Date.now();
    this.socket = new WebSocket(options.websocketEndpoint);

    this.socket.on("open", () => {
      this.send(<RegisterEvent>{
        type: "REGISTER",
        display_name: options.display_name,
        entry_url: options.entry_url,
        healthcheck_url: options.healthcheck_url || options.entry_url,
        timestamp: Date.now()
      });
    });

    this.socket.on("message", event => {
      console.debug(event);
    });
  }

  get stats() {
    return {
      uptime: Date.now() - Number(this.createdAt)
    };
  }

  setState(state: Partial<ClientHost>) {
    this.send({
      type: "UPDATE",
      data: state,
      timestamp: Date.now()
    });
  }

  send(message: ClientServerWebSocketMessage) {
    const json = JSON.stringify({
      ...message,
      timestamp: Date.now()
    });

    this.socket.send(json);
  }
}

type Options = {
  entry_url?: string;
  port: number;
  healthcheck_url?: string;
  meta?: object;
};

export async function initialize(
  app: Application,
  options: Options
): Application {
  const meta = options.meta || {};
  let entry_url = options.entry_url;
  let healthcheck_url = options.healthcheck_url || entry_url;

  let agent: P2PwnAgent;
  if (entry_url && healthcheck_url) {
    agent = new P2PwnAgent({
      ...meta,
      entry_url,
      healthcheck_url,
      websocketEndpoint: "wss://p2pwn-production.herokuapp.com"
    });
  } else if (typeof options.port === "number") {
    await new Promise<P2PwnAgent>((resolve, reject) => {
      localtunnel(options.port, (err, { url }) => {
        if (err) {
          reject(err);
          return process.exit(1);
        }
        console.log(`Tunnel created to: ${url}`);

        resolve(
          new P2PwnAgent({
            ...meta,
            entry_url: url,
            healthcheck_url: `${url}/_p2pwn/health`,
            websocketEndpoint: "wss://p2pwn-production.herokuapp.com"
          })
        );
      });
    }).then(_agent => {
      agent = _agent;
    });
  } else {
    throw new Error("Please provide a port for P2Pwn to connect to");
  }
  app.get("/_p2pwn/health", (req, res) => {
    res.sendStatus(200);
  });
  app.get("/_p2pwn/stats", (req, res, next) => {
    res.json(agent.stats);
  });

  return app;
}
