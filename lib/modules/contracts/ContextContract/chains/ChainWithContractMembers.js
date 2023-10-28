var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError("Cannot " + msg);
  }
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError("Cannot add the same private member more than once");
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
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

// src/modules/contracts/ContextContract/handlers/HandlerProxy.ts
var HandlerProxy = class extends HandleFnHandler {
  constructor(fn, handleFn) {
    super(handleFn);
    this.function_name = fn;
    this.metadata = {
      name: `__HandlerProxy__${fn}`,
    };
  }
  handle(context) {
    return Promise.resolve().then(() => ContextShapeValidator.validate(context))
      .then((validatedContext) => {
        const incomingFn = validatedContext.action.input.function;
        if (incomingFn !== this.function_name) {
          return super.sendToNextHandler(validatedContext);
        }
        return validatedContext;
      }).then((validatedContext) => {
        const c = this.handlerFn(validatedContext);
        return c;
      });
  }
};

// src/modules/contracts/ContextContract/chains/ChainWithContractMembers.ts
var _functions;
var _ChainWithContractMembers = class _ChainWithContractMembers extends Chain {
  constructor(state) {
    super();
    this.handlers = [];
    __privateAdd(this, _functions, []);
    this.contract_state = state || {};
  }
  get functions() {
    return __privateGet(this, _functions);
  }
  /**
   * Set the contract's initial state.
   * @param initialState The contract's initial state.
   * @returns This builder for further method chaining.
   */
  initialState(initialState) {
    return new _ChainWithContractMembers(initialState);
  }
  /**
   * Add an interaction handler to the contract. Interaction handlers evaluate
   * the `state` and `interaction` objects received from the network and can
   * modify the state based on the data sent in the `interaction` object.
   * @param fnName The name of the function the handler handles.
   * @param handler The interaction handler.
   * @returns This builder.
   */
  action(fn, handler) {
    if (typeof fn !== "string") {
      if (!("function_name" in fn)) {
        throw new Error(`Handler is missing 'function_name' property`);
      }
      if (!("handle" in fn)) {
        throw new Error(`Handler is missing 'handle()' method`);
      }
      return this.action(fn.function_name, function (context) {
        return fn.handle(context);
      });
    }
    if (!handler) {
      throw new Error(
        `Cannot create an interaction handler without a handler function`,
      );
    }
    this.functions.push(fn);
    const wrappedHandler = new HandlerProxy(fn, handler);
    this.chain_builder.handler(wrappedHandler);
    return this;
  }
  /**
   * Build the contract that can handle state and interactions.
   *
   * @returns A `Contract` instance. Its only method is `handle()`, which should
   * be used to pass the `state` and `interaction` objects received from the
   * network. These objects should be wrapped in a single object known as the
   * `context` object in this library. See example.
   *
   * @example
   * ```ts
   * const contract = Contract.builder().build();
   *
   * export function handle(state, interaction) {
   *   return contract
   *     .handle({ state, interaction }) // Put the `state` and `interaction` into a single object. This will be the `context` object.
   *     .then((context) => {
   *       return { state: context.state };
   *     })
   *     .catch((e) => {
   *       throw new ContractError(e.message ?? "We hit an error");
   *     });
   * }
   * ```
   */
  build() {
    const guard = new IncomingFunctionValidator(this.functions);
    const functions = this.functions;
    const firstHandler = super.build();
    return {
      functions,
      handle: (context) => {
        return Promise.resolve().then(() => guard.handle(context)).then(() =>
          firstHandler.handle(context)
        );
      },
    };
  }
};
_functions = new WeakMap();
var ChainWithContractMembers = _ChainWithContractMembers;

export { ChainWithContractMembers };
