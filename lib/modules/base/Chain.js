// src/core/AbstractChainBuilder.ts
var AbstractChainBuilder = class {
  constructor() {
    /**
     * The handlers in this chain.
     */
    this.handlers = [];
  }
  /**
   * Add the given `handler` to this chain.
   * @param handler
   * @returns
   */
  handler(handler) {
    this.handlers.push(handler);
    return this;
  }
  /**
   * @param handlers The handlers that will be chained together.
   * @returns The first handler in the chain.
   */
  createChain() {
    if (!this.handlers) {
      throw new Error("Chain.Builder: `this.handlers` should be an array");
    }
    if (!this.handlers.length) {
      throw new Error("Chain.Builder: `this.handlers` is empty");
    }
    const firstHandler = this.handlers[0];
    this.handlers.reduce((previous, current) => {
      return previous.setNextHandler(current);
    });
    return firstHandler;
  }
};

// src/modules/base/Chain.ts
var ChainBuilder = class extends AbstractChainBuilder {
  build() {
    return this.createChain();
  }
};
var Chain = class {
  constructor() {
    this.chain_builder = new ChainBuilder();
  }
  build() {
    const chain = this.chain_builder.build();
    return chain;
  }
};

export { Chain };
