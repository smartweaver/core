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

// src/modules/clients/Arweave/utils/tagger.ts
function tag(taggable, tags) {
  for (const [key, value] of Object.entries(tags)) {
    taggable.addTag(key, value);
  }
}

// src/modules/clients/Arweave/handlers/TransactionTagger.ts
var TransactionTagger = class extends Handler {
  handle(context) {
    tag(context.transaction, context.tags);
    return super.sendToNextHandler(context);
  }
};

export { TransactionTagger };
