import * as Url from "url";

type HostConnection = {
  hostname: string;
  port: number;
};
type HostRegistrationOffer = {
  endpoint: string;
};

class Store {
  public readonly connections: HostConnection[];

  constructor() {
    this.connections = [];
  }

  register(registrationOffer: HostRegistrationOffer) {
    const registration = validateOffer(registrationOffer);

    this.connections.push(registration);

    return registration;
  }
}

/**
 * Validates the offer is valid before passing it to the store.
 * @param request An offer to register a host connection with the server
 */
function validateOffer(request: HostRegistrationOffer): HostConnection {
  const { hostname, port } = Url.parse(request.endpoint);

  if (!(hostname && port)) {
    throw new Error(`Invalid host connection: ${request}`);
  }

  return {
    hostname,
    port: parseInt(port)
  };
}

// TODO: Make this store better. Just storing in a plain object for now
const store = new Store();

export default store;
