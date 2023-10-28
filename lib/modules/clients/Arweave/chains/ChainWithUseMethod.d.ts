import { Handler } from "../../../../core/Handler.js";
import { Chain } from "../../../base/Chain.js";
import { ContextHandlerFunction } from "../../../base/HandleFnHandler.js";
import "../../../../core/AbstractChainBuilder.js";

declare class ChainWithUseMethod extends Chain {
  #private;
  /**
   * Use the given `handler` in this chain.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  use(handler: ContextHandlerFunction | Handler): this;
}

export { ChainWithUseMethod };
