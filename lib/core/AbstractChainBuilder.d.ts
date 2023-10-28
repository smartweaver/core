import { Handler } from "./Handler.js";

declare abstract class AbstractChainBuilder {
  /**
   * The handlers in this chain.
   */
  protected handlers: Handler[];
  /**
   * Build the product this builder builds.
   */
  abstract build(): unknown;
  /**
   * Add the given `handler` to this chain.
   * @param handler
   * @returns
   */
  handler(handler: Handler): this;
  /**
   * @param handlers The handlers that will be chained together.
   * @returns The first handler in the chain.
   */
  protected createChain(): Handler;
}

export { AbstractChainBuilder };
