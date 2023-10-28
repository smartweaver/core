var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError("Cannot " + msg);
  }
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError("Cannot add the same private member more than once");
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/core/Handler.ts
var Handler = class {
  constructor() {
    this.next_handler = null;
  }
  /**
   * Handle the context.
   * @param context An object containing the data passed between each handler.
   * @returns The context.
   */
  handle(context) {
    return Promise.resolve().then(() => {
      if (this.next_handler) {
        return this.next_handler.handle(context);
      }
      return context;
    });
  }
  /**
   * A convenience method so extended handlers can be written succintly. See
   * example.
   * @param context An object containing the data passed between each handler.
   * @returns The context.
   *
   * @example
   * ```ts
   * class MyHandler extends AbstractHandler {
   *   handle(context: Context): Promise<Context> {
   *     if (!context.something) {
   *       super.sendToNextHandler(context;)
   *     }
   *   }
   * }
   * ```
   */
  sendToNextHandler(context) {
    return Promise.resolve().then(() => {
      if (this.next_handler !== null) {
        return this.next_handler.handle(context);
      }
      return context;
    });
  }
  /**
   * Set this handler's next handler.
   * @param nextHandler The handler to use if `super.sendToNextHandler()` is called.
   * @returns The given next handler
   */
  setNextHandler(nextHandler) {
    this.next_handler = nextHandler;
    return nextHandler;
  }
};

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

// src/modules/base/HandleFnHandler.ts
var HandleFnHandler = class extends Handler {
  constructor(handleFn) {
    super();
    this.handlerFn = handleFn;
  }
  handle(context) {
    return Promise.resolve().then(() => this.handlerFn(context)).then((
      returnedContext,
    ) => super.sendToNextHandler(returnedContext));
  }
};

// src/modules/clients/Arweave/chains/ChainWithUseMethod.ts
var _addHandlerToChain, addHandlerToChain_fn;
var ChainWithUseMethod = class extends Chain {
  constructor() {
    super(...arguments);
    /**
     * Add the given `handler` to the chain. This method is not exposed to the
     * public API reads as `Chain.builder().use(...).use(...).build()`.
     *
     * @param handler The handler in question.
     * @returns This instance for further method chaining.
     */
    __privateAdd(this, _addHandlerToChain);
  }
  /**
   * Use the given `handler` in this chain.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  use(handler) {
    return __privateMethod(this, _addHandlerToChain, addHandlerToChain_fn).call(
      this,
      handler,
    );
  }
};
_addHandlerToChain = new WeakSet();
addHandlerToChain_fn = function (handler) {
  if (handler instanceof Handler) {
    this.chain_builder.handler(handler);
    return this;
  }
  this.chain_builder.handler(new HandleFnHandler(handler));
  return this;
};

export { ChainWithUseMethod };
