export interface ClientHost {
  id: string;
  access_token: string;
  display_name: string;
  entry_url: string;
  healthcheck_url: string;
  [key: string]: any;
}

export type HostRegistrationOffer = {
  display_name?: string;
  entry_url: string;
  healthcheck_url: string;
};

export interface RegisterEvent
  extends BaseClientServerWebSocketMessage,
    HostRegistrationOffer {
  type: "REGISTER";
}

export interface UpdateEvent extends BaseClientServerWebSocketMessage {
  type: "UPDATE";
  data: Partial<ClientHost>;
}

export interface UnregisterEvent extends BaseClientServerWebSocketMessage {
  type: "UNREGISTER";
}

export interface BaseClientServerWebSocketMessage {
  type: string;
  timestamp: Date | number;
  [K: string]: any;
}

export declare type ClientServerWebSocketMessage =
  | RegisterEvent
  | UnregisterEvent
  | UpdateEvent;
