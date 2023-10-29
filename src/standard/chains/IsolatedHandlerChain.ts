import { AbstractChainBuilder } from "../../core/chains/AbstractChainBuilder.ts";
import { HandlerWithFunctionName } from "../handlers/HandlerWithFunctionName.ts";

/**
 * This class is labeled as a chain builder, but it is important to note that
 * THIS CLASS DOES NOT LINK ITS HANDLERS TOGETHER. Instead, it stores them in
 * key-value pairs so that handlers can be called in isolation instead of being
 * able to pass their inputs to a next handler.
 */
class IsolatedHandlerChainBuilder
  extends AbstractChainBuilder<HandlerWithFunctionName> {
  /**
   * Build a key-value pair object of the handlers.
   * @returns The handlers in key-value pairs where the key is their
   * `function_name` property and the value is their instance.
   */
  build() {
    if (!this.handlers) {
      throw new Error("Chain.Builder: `this.handlers` should be an array");
    }

    if (!this.handlers.length) {
      throw new Error("Chain.Builder: `this.handlers` is empty");
    }

    const handlerMap = new Map<string, HandlerWithFunctionName>();

    for (const handler of this.handlers) {
      handlerMap.set(handler.function_name, handler);
    }

    return handlerMap;
  }
}

/**
 * This differs from the `NextableHandlerChain` because each handler in this
 * chain is looked up by their key.
 */
export class IsolatedHandlerChain {
  protected chain_builder: IsolatedHandlerChainBuilder =
    new IsolatedHandlerChainBuilder();
}
