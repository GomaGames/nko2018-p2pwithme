import Url from "url";
import uuid from "uuid/v4";

import { ClientHost, HostRegistrationOffer } from "../../types";

/**
 * Global Store because databases are not MVP enough for POC
 */
class Store {
  public readonly hosts: ClientHost[];

  constructor() {
    this.hosts = [];
  }

  register(registrationOffer: HostRegistrationOffer) {
    const registration = validateOffer(registrationOffer);

    this.hosts.push(registration);

    return registration;
  }

  unregister(access_token: string): ClientHost | null {
    const connectionIndex = this.hosts.findIndex(
      connection => connection.access_token === access_token
    );

    if (connectionIndex > -1) {
      return this.hosts.splice(connectionIndex, 1)[0];
    } else {
      return null;
    }
  }

  update(id: string, data: Partial<ClientHost>, access_token: string) {
    const host = this.hosts.find(
      host => host.id === id && host.access_token === access_token
    );
    if (host) {
      for (let prop in data) {
        if (!host.hasOwnProperty(prop)) {
          continue;
        }

        switch (prop) {
          case "id":
          case "access_token":
            // Ignore these properties!
            continue;
          default:
            (host as any)[prop] = (data as any)[prop];
        }
      }
      return host;
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

  const length = store.hosts.length + 1;
  return {
    ...request,
    id: uuid(),
    access_token: uuid(),
    display_name: display_name || `Lobby ${length}`,
    entry_url
  };
}

// TODO: Make this store better. Just storing in a plain object for now
const store = new Store();

export default store;
