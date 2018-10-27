import Url from "url";
import uuid from "uuid/v4";

import { ClientHost, HostRegistrationOffer } from "../../types";

/**
 * Global Store because databases are not MVP enough for POC
 */
class Store {
  public readonly connections: ClientHost[];

  constructor() {
    this.connections = [];
  }

  register(registrationOffer: HostRegistrationOffer) {
    const registration = validateOffer(registrationOffer);

    this.connections.push(registration);

    return registration;
  }

  unregister(access_token: string): ClientHost | null {
    const connectionIndex = this.connections.findIndex(
      connection => connection.access_token === access_token
    );

    if (connectionIndex > -1) {
      return this.connections.splice(connectionIndex, 1)[0];
    } else {
      return null;
    }
  }
}

/**
 * Validates the offer is valid before passing it to the store.
 * @param request An offer to register a host connection with the server
 */
function validateOffer(request: HostRegistrationOffer): ClientHost {
  const { display_name, entry_url } = request;
  const { hostname, port } = Url.parse(entry_url);

  const length = store.connections.length + 1;
  return {
    id: uuid(),
    access_token: uuid(),
    display_name: display_name || `Lobby ${length}`,
    entry_url
  };
}

// TODO: Make this store better. Just storing in a plain object for now
const store = new Store();

export default store;
