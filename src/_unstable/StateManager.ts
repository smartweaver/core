export class StoreManager<S> {
  #store: S;

  constructor(store: S) {
    this.#store = store;
  }

  handle() {}
}
