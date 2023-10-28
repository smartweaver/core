import Arweave from 'arweave';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

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

// src/modules/clients/Arweave/handlers/TransactionSigner.ts
var TransactionSigner = class extends ArweaveHandler {
  handle(context) {
    if (!context.transaction) {
      return this.next(context);
    }
    return this.arweave.transactions.sign(context.transaction, context.creator).then(() => super.next(context));
  }
};

// src/modules/clients/Arweave/handlers/TransactionPoster.ts
var TransactionPoster = class extends ArweaveHandler {
  handle(context) {
    if (!context.transaction) {
      return super.next(context);
    }
    return this.arweave.transactions.post(context.transaction).then((result) => {
      context.transaction_post_result = result;
    }).then(() => super.next(context));
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

// src/modules/clients/Arweave/handlers/ContractTransactionCreator.ts
var _validate, validate_fn;
var ContractTransactionCreator = class extends TransactionCreator {
  constructor() {
    super(...arguments);
    __privateAdd(this, _validate);
  }
  handle(context) {
    return Promise.resolve().then(() => {
      __privateMethod(this, _validate, validate_fn).call(this, context);
      context.transaction_attributes.data = context.initial_state.data;
      return super.handle(context);
    });
  }
};
_validate = new WeakSet();
validate_fn = function(context) {
  if (!context || typeof context !== "object") {
    throw new Error(`Handler argument \`context\` should be an object`);
  }
  if (!("source_code_id" in context) || !context.source_code_id) {
    throw new Error(`Field \`source_code_id\` is required`);
  }
  if (typeof context.source_code_id !== "string") {
    throw new Error(`Field \`source_code_id\` should be a string`);
  }
  if (!("initial_state" in context) || !context.initial_state || typeof context.initial_state !== "object") {
    throw new Error(`Field \`initial_state\` is required`);
  }
};

// src/modules/clients/Arweave/utils/tagger.ts
function tag(taggable, tags) {
  for (const [key, value] of Object.entries(tags)) {
    taggable.addTag(key, value);
  }
}
function createSourceCodeTransactionTags(extraTags = {}) {
  return __spreadValues({
    "App-Name": "SmartWeaveContractSource",
    "App-Version": "0.3.0",
    // TODO(crookse) Configurable
    "Content-Type": "application/javascript",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract_source"
    })
  }, extraTags);
}
function createContractTransactionTags(sourceCodeTransactionId, extraTags = {}) {
  return __spreadValues({
    "App-Name": "SmartWeaveContract",
    "App-Version": "0.3.0",
    // TODO(crookse) Configurable
    "Contract-Src": sourceCodeTransactionId,
    "Content-Type": "application/json",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract"
    })
  }, extraTags);
}

// src/modules/clients/Arweave/handlers/TransactionTagger.ts
var TransactionTagger = class extends NextableHandler {
  handle(context) {
    return Promise.resolve().then(() => tag(context.transaction, context.tags)).then(() => super.next(context));
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
};

// src/modules/base/NextableHandlerChain.ts
var ChainBuilder = class extends AbstractChainBuilder {
  build() {
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
var _chain_builder;
var NextableHandlerChain = class {
  constructor() {
    /**
     * TODO(crookse) Make succint.
     * This class hides the actual chain builder so the exposed members are
     * controlled by the extending class.
     */
    __privateAdd(this, _chain_builder, new ChainBuilder());
  }
  handler(handler) {
    __privateGet(this, _chain_builder).handler(handler);
    return this;
  }
  build() {
    const chain = __privateGet(this, _chain_builder).build();
    return {
      handle: (context) => {
        return chain.handle(context);
      }
    };
  }
};
_chain_builder = new WeakMap();

// src/modules/clients/Arweave/chains/ChainWithUseMethod.ts
var _addHandlerToChain, addHandlerToChain_fn;
var ChainWithUseMethod = class extends NextableHandlerChain {
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
    return __privateMethod(this, _addHandlerToChain, addHandlerToChain_fn).call(this, handler);
  }
};
_addHandlerToChain = new WeakSet();
addHandlerToChain_fn = function(handler) {
  if (handler instanceof NextableHandler) {
    this.handler(handler);
    return this;
  }
  this.handler(new AnonymousFnHandlerProxy(handler));
  return this;
};
var AnonymousFnHandlerProxy = class extends NextableHandler {
  constructor(handleFn) {
    super();
    this.handleFn = handleFn;
  }
  handle(context) {
    return Promise.resolve().then(() => this.handleFn(context)).then((returnedContext) => super.next(returnedContext));
  }
};

// src/modules/clients/Arweave/chains/DeployChain.ts
function buildDeployChain(options) {
  const apiConfig = options.api_config || {};
  const tagger = new TransactionTagger();
  const builder = new ChainWithUseMethod();
  return builder.use((context) => {
    context.transaction_attributes = context.source_code;
    return context;
  }).use(new TransactionCreator(apiConfig)).use(
    (context) => tagger.handle(__spreadProps(__spreadValues({}, context), {
      tags: createSourceCodeTransactionTags()
    }))
  ).use(new TransactionSigner(apiConfig)).use(new TransactionPoster(apiConfig)).use((context) => {
    context.source_code_id = context.transaction.id;
    context.transaction = null;
    return context;
  }).use(new ContractTransactionCreator(apiConfig)).use(
    (context) => tagger.handle(__spreadProps(__spreadValues({}, context), {
      tags: createContractTransactionTags(context.source_code_id)
    }))
  ).use(new TransactionSigner(apiConfig)).use(new TransactionPoster(apiConfig)).use((context) => {
    context.contract_id = context.transaction.id;
    context.transaction = null;
    return context;
  }).use((context) => {
    return {
      source_code_id: context.source_code_id,
      contract_id: context.contract_id
    };
  }).build();
}
var DeployChain = class {
  /**
   * Create a chain of handlers that result in creating a:
   * - contract source code transaction; and
   * - contract transaction.
   *
   * The term "deploy" is used to emphasize that the transactions will be
   * deployed to the network.
   *
   * @param options See {@linkcode DeployChainCreateOptions}
   * @returns The deploy chain's handler.
   *
   * @example
   * ```
   * const chain = DeployChain.create({ api_config: { port: 1984 } });
   *
   * const result = await chain
   *   .handle({
   *     creator: {
   *       kty: "",
   *       n: "",
   *       e: "",
   *       d: "",
   *       p: "",
   *       q: "",
   *       dp: "",
   *       dq: "",
   *       qi: ""
   *     },
   *     source_code: {
   *       data: "export function handle(state, action) { ... }",
   *     },
   *     initial_state: {
   *       data: JSON.stringify({}),
   *     },
   *   });
   * ```
   */
  static create(options) {
    return buildDeployChain(options);
  }
};

export { DeployChain };
