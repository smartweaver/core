import { Handler } from "../../../../core/Handler.ts";
import { Chain } from "../../../base/Chain.ts";
import { ContextHandlerFunction, HandleFnHandler } from "../../../base/HandleFnHandler.ts";

export class ChainWithUseMethod extends Chain {
  /**
   * Use the given `handler` in this chain.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  use(handler: ContextHandlerFunction | Handler) {
    return this.#addHandlerToChain(handler);
  }

  /**
   * Add the given `handler` to the chain. This method is not exposed to the
   * public API reads as `Chain.builder().use(...).use(...).build()`.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  #addHandlerToChain(handler: ContextHandlerFunction | Handler): this {
    if (handler instanceof Handler) {
      this.chain_builder.handler(handler);
      return this;
    }

    this.chain_builder.handler(new HandleFnHandler(handler));
    return this;
  }
}
