import { interactRead } from 'smartweave';
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

// src/modules/clients/Arweave/utils/tagger.ts
function toNameValueArray(tags) {
  const ret = [];
  for (const [name, value] of Object.entries(tags)) {
    ret.push({
      name,
      value
    });
  }
  return ret;
}

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

// src/modules/clients/Arweave/handlers/SmartWeaveContractInteractReader.ts
var SmartWeaveContractInteractReader = class extends ArweaveHandler {
  handle(context) {
    return Promise.resolve().then(() => {
      var _a, _b, _c, _d;
      return interactRead(
        this.arweave,
        context.creator,
        context.contract_id,
        (_a = context.input) != null ? _a : {},
        toNameValueArray((_b = context.tags) != null ? _b : {}),
        (_c = context.target) != null ? _c : "",
        (_d = context.winston_qty) != null ? _d : ""
      );
    }).then((result) => {
      return __spreadProps(__spreadValues({}, context), {
        read_result: result
      });
    }).then((newContext) => super.next(newContext));
  }
};

export { SmartWeaveContractInteractReader };
