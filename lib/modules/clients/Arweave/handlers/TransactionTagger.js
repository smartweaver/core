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

// src/modules/clients/Arweave/utils/tagger.ts
function tag(taggable, tags) {
  for (const [key, value] of Object.entries(tags)) {
    taggable.addTag(key, value);
  }
}

// src/modules/clients/Arweave/handlers/TransactionTagger.ts
var TransactionTagger = class extends NextableHandler {
  handle(context) {
    return Promise.resolve().then(() => tag(context.transaction, context.tags)).then(() => super.next(context));
  }
};

export { TransactionTagger };
