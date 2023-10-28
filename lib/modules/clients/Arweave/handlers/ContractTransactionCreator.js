import Arweave from "arweave";

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

// src/modules/clients/Arweave/handlers/TransactionHandler.ts
var TransactionHandler = class extends Handler {
  constructor(apiConfig) {
    super();
    this.arweave = new Arweave(apiConfig);
  }
};

// src/modules/clients/Arweave/handlers/TransactionCreator.ts
var TransactionCreator = class extends TransactionHandler {
  handle(context) {
    return this.arweave.createTransaction(
      context.transaction_attributes,
      context.creator,
    ).then((transaction) => {
      context.transaction = transaction;
    }).then(() => super.sendToNextHandler(context));
  }
};

// src/modules/clients/Arweave/handlers/ContractTransactionCreator.ts
var _validate, validate_fn;
var ContractTransactionCreator = class extends TransactionCreator {
  constructor() {
    super(...arguments);
    __privateAdd(this, _validate);
  }
  handle(context) {
    __privateMethod(this, _validate, validate_fn).call(this, context);
    context.transaction_attributes.data = context.initial_state.data;
    return super.handle(context).then(() => super.sendToNextHandler(context));
  }
};
_validate = new WeakSet();
validate_fn = function (context) {
  if (!context || typeof context !== "object") {
    throw new Error(`Handler argument \`context\` should be an object`);
  }
  if (!("source_code_id" in context) || !context.source_code_id) {
    throw new Error(`Field \`source_code_id\` is required`);
  }
  if (typeof context.source_code_id !== "string") {
    throw new Error(`Field \`source_code_id\` should be a string`);
  }
  if (
    !("initial_state" in context) || !context.initial_state ||
    typeof context.initial_state !== "object"
  ) {
    throw new Error(`Field \`initial_state\` is required`);
  }
};

export { ContractTransactionCreator };
