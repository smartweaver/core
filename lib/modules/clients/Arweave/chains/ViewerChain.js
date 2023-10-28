import Arweave from 'arweave';
import { readContract } from 'smartweave';

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
var SmartWeaveContractViewer = class extends ArweaveHandler {
  handle(context) {
    return Promise.resolve().then(() => {
      return readContract(
        this.arweave,
        context.contract_id,
        context.height,
        context.return_validity
      );
    }).then((result) => {
      return __spreadProps(__spreadValues({}, context), {
        read_result: result
      });
    }).then((newContext) => super.next(newContext));
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

// src/modules/clients/Arweave/chains/ViewerChain.ts
function buildViewerChain(options) {
  const apiConfig = options.api_config || {};
  const builder = new ChainWithUseMethod();
  return builder.use(new SmartWeaveContractViewer(apiConfig)).use((context) => {
    return {
      read_result: context.read_result
    };
  }).build();
}
var ViewerChain = class {
  /**
   * Create a chain of handlers that result in creating an "interaction"
   * transaction on a contract.
   *
   * @param options See {@linkcode ViewerChainCreateOptions}
   * @returns The view chain's handler.
   *
   * @example
   * ```
   * const chain = ViewerChain.create({ api_config: { port: 1984 } });
   *
   * const result = await client
   *   .handle<{
   *     interaction_transaction: Transaction;
   *   }>({
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
   *     contract_id: "",
   *     input: { function: "greet", payload: { message: "Hello" } }
   *   });
   * ```
   */
  static create(options) {
    return buildViewerChain(options);
  }
};

export { ViewerChain };
