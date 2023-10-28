var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
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

// src/modules/base/AnonymousFnHandler.ts
var AnonymousFnHandler = class {
  constructor(handleFn) {
    this.handlerFn = handleFn;
  }
  handle(context) {
    return Promise.resolve().then(() => this.handlerFn(context));
  }
};

// src/modules/contracts/ContextContract/handlers/HandlerProxy.ts
var HandlerProxy = class extends AnonymousFnHandler {
  constructor(fn, handleFn) {
    super(handleFn);
    this.function_name = fn;
    this.metadata = {
      name: `__HandlerProxy__${fn}`
    };
  }
  handle(context) {
    return Promise.resolve().then(() => {
      const incomingFn = context.action.input.function;
      if (incomingFn !== this.function_name) {
        return context;
      }
      return super.handle(context);
    });
  }
};

// src/modules/contracts/ContextContract/chains/ChainWithContractMembers.ts
var _functions;
var _ChainWithContractMembers = class _ChainWithContractMembers extends IsolatedHandlerChain {
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
      return this.action(fn.function_name, function(context) {
        return fn.handle(context);
      });
    }
    if (__privateGet(this, _functions).includes(fn)) {
      throw new Error(
        `Duplicate action name "${fn}" provided in \`.action(...)\` call`
      );
    }
    if (!handler) {
      throw new Error(
        `Cannot create an interaction handler without a handler function`
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
    const functions = this.functions;
    const firstHandler = super.build();
    return {
      functions,
      handle: (context) => {
        return Promise.resolve().then(() => validateContext(context, functions)).then(() => firstHandler.handle(context)).then((returnedContext) => returnedContext);
      }
    };
  }
};
_functions = new WeakMap();
var ChainWithContractMembers = _ChainWithContractMembers;
function validateContext(context, functions) {
  return Promise.resolve().then(() => validateContextShape(context)).then((validatedContext) => {
    if (!functions || !functions.length) {
      throw new Error(`Contract does not have functions defined`);
    }
    const incomingFunction = validatedContext.action.input.function;
    if (!functions.includes(incomingFunction)) {
      throw new Error(`Unknown function '${incomingFunction}' provided`);
    }
    return context;
  });
}
function validateContextShape(context) {
  if (!context) {
    throw new Error(`Unexpected missing \`context\` object`);
  }
  if (typeof context !== "object") {
    throw new Error(`Argument 'context' should be an object`);
  }
  if (!("state" in context) || !context.state) {
    throw new Error(
      `Field 'context.state' is required`
    );
  }
  if (!("action" in context) || !context.action || typeof context.action !== "object") {
    throw new Error(
      `Field 'context.action' should be an object`
    );
  }
  if (!("input" in context.action) || !context.action.input || typeof context.action.input !== "object") {
    throw new Error(
      `Field 'context.action.input' should be an object`
    );
  }
  if (!("function" in context.action.input) || !context.action.input.function || typeof context.action.input.function !== "string") {
    throw new Error(
      `Field 'context.action.input.function' should be a string`
    );
  }
  return context;
}

// src/modules/contracts/ContextContract/handlers/Handler.ts
var Handler = class {
  constructor(functionName) {
    this.function_name = functionName;
  }
};

// src/modules/contracts/ContextContract/mod.ts
var Contract = class {
  static builder() {
    return new ChainWithContractMembers();
  }
};
/**
 * Handler class that should be extended and used by users of the `Contract`.
 * To ensure this contract handles all handlers properly, handlers should be
 * of this handler type.
 */
Contract.Handler = Handler;

export { Contract };
