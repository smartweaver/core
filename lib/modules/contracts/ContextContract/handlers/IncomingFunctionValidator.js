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

// src/modules/contracts/ContextContract/validators/ContextShapeValidator.ts
var ContextShapeValidator = class {
  /**
   * Validate that the given `context` is in a shape expected by contracts.
   * @param context The context in question.
   */
  static validate(context) {
    if (!context) {
      throw new Error(`Unexpected missing \`context\` object`);
    }
    if (typeof context !== "object") {
      throw new Error(`Argument 'context' should be an object`);
    }
    if (
      !("action" in context) || !context.action ||
      typeof context.action !== "object"
    ) {
      throw new Error(
        `Field 'context.action' should be an object`,
      );
    }
    if (
      !("input" in context.action) || !context.action.input ||
      typeof context.action.input !== "object"
    ) {
      throw new Error(
        `Field 'context.action.input' should be an object`,
      );
    }
    if (
      !("function" in context.action.input) || !context.action.input.function ||
      typeof context.action.input.function !== "string"
    ) {
      throw new Error(
        `Field 'context.action.input.function' should be a string`,
      );
    }
    return context;
  }
};

// src/modules/contracts/ContextContract/handlers/IncomingFunctionValidator.ts
var IncomingFunctionValidator = class extends Handler {
  constructor(functions) {
    super();
    this.functions = functions;
  }
  /**
   * Check that the incoming context can be handled.
   * @param context
   * @returns The resulting state.
   */
  handle(context) {
    return Promise.resolve().then(() => ContextShapeValidator.validate(context))
      .then(() => {
        if (!this.functions || !this.functions.length) {
          throw new Error(`Contract does not have functions defined`);
        }
        const incomingFunction = context.action.input.function;
        if (!this.functions.includes(incomingFunction)) {
          throw new Error(`Unknown function '${incomingFunction}' provided`);
        }
      }).then(() => super.sendToNextHandler(context));
  }
};

export { IncomingFunctionValidator };
