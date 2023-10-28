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
};

// src/modules/base/IsolatedHandlerChain.ts
var ChainBuilder = class extends AbstractChainBuilder {
  /**
   * Build the chain -- linking all handlers in sequential order.
   * @returns The first handler.
   */
  build() {
    if (!this.handlers) {
      throw new Error("Chain.Builder: `this.handlers` should be an array");
    }
    if (!this.handlers.length) {
      throw new Error("Chain.Builder: `this.handlers` is empty");
    }
    return {
      handle: (context) => {
        for (const handler of this.handlers) {
          handler.handle(context);
        }
        return context;
      }
    };
  }
};
var IsolatedHandlerChain = class {
  constructor() {
    this.chain_builder = new ChainBuilder();
  }
  build() {
    const chain = this.chain_builder.build();
    return chain;
  }
};

export { IsolatedHandlerChain };
