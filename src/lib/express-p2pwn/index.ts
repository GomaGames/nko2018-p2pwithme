import WebSocket from "ws";
import { Application } from "express";

import { ClientServerWebSocketMessage, ClientHost } from "../../../types";

type AgentOptions = {
  websocketEndpoint: string;
};

class P2PwnAgent {
  private socket: WebSocket;
  public readonly createdAt: Date | number;

  constructor(options: AgentOptions) {
    this.createdAt = Date.now();
    this.socket = new WebSocket(options.websocketEndpoint);

    this.socket.on("open", () => {
      this.send({
        type: "REGISTER",
        display_name: "Best game ever",
        entry_url: "https://localhost:3001",
        timestamp: Date.now()
      });
      this.setState({});
    });

    this.socket.on("message", event => {
      console.log(event);
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

export function initialize(
  app: Application,
  options: AgentOptions
): Application {
  const agent = new P2PwnAgent(options);

  app.get("/p2pwn/stats", (req, res, next) => {
    res.json(agent.stats);
  });

  return app;
}
