import type { Handler } from "../handlers/Handler";

export abstract class AbstractChainBuilder<H extends Handler = Handler> {
  /**
   * The handlers in this chain.
   */
  handlers: H[] = [];

  /**
   * Build the chain.
   */
  abstract build(): unknown;

  /**
   * Add the given `handler` to this chain.
   * @param handler
   * @returns
   */
  public handler(handler: H): this {
    this.handlers.push(handler);

    return this;
  }
}
