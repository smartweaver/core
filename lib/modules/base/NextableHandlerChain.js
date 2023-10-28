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

export { NextableHandlerChain };
