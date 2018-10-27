type HostConnection = {};

class Store {
  public readonly connections: HostConnection[];

  constructor() {
    this.connections = [];
  }
}

// TODO: Make this store better. Just storing in a plain object for now
const store = new Store();

export default store;
