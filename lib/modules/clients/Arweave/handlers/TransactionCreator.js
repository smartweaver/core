import Arweave from 'arweave';

// src/modules/clients/Arweave/handlers/ArweaveHandler.ts

// src/modules/base/NextableHandler.ts
var NextableHandler = class {
  constructor() {
    this.next_handler = null;
  }
  handle(context) {
    return this.next(context);
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
   *       super.next(context;)
   *     }
   *   }
   * }
   * ```
   */
  next(context) {
    return Promise.resolve().then(() => {
      if (this.next_handler !== null) {
        return this.next_handler.handle(context);
      }
      return context;
    });
  }
  /**
   * Set this handler's next handler.
   * @param nextHandler The handler to use if `super.next()` is called.
   * @returns The given next handler
   */
  setNextHandler(nextHandler) {
    this.next_handler = nextHandler;
    return nextHandler;
  }
};

// src/modules/clients/Arweave/handlers/ArweaveHandler.ts
var ArweaveHandler = class extends NextableHandler {
  constructor(apiConfig) {
    super();
    this.arweave = new Arweave(apiConfig);
  }
};

// src/modules/clients/Arweave/handlers/TransactionCreator.ts
var TransactionCreator = class extends ArweaveHandler {
  handle(context) {
    return this.arweave.createTransaction(context.transaction_attributes, context.creator).then((transaction) => {
      context.transaction = transaction;
    }).then(() => super.next(context));
  }
};

export { TransactionCreator };
