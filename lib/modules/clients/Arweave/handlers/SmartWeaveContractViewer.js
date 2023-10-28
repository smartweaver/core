import Arweave from "arweave";
import { readContract } from "smartweave";

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value,
    })
    : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) {
    if (__hasOwnProp.call(b, prop)) {
      __defNormalProp(a, prop, b[prop]);
    }
  }
  if (__getOwnPropSymbols) {
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) {
        __defNormalProp(a, prop, b[prop]);
      }
    }
  }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

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
var SmartWeaveContractViewer = class extends TransactionHandler {
  handle(context) {
    return Promise.resolve().then(() => {
      return readContract(
        this.arweave,
        context.contract_id,
        context.height,
        context.return_validity,
      );
    }).then((result) => {
      return __spreadProps(__spreadValues({}, context), {
        read_result: result,
      });
    }).then((newContext) => super.sendToNextHandler(newContext));
  }
};

export { SmartWeaveContractViewer };
