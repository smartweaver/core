import { Handler } from "./Handler.ts";

export abstract class AbstractChainBuilder {
  /**
   * The handlers in this chain.
   */
  protected handlers: Handler[] = [];

  /**
   * Build the product this builder builds.
   */
  abstract build(): unknown;

  /**
   * Add the given `handler` to this chain.
   * @param handler
   * @returns
   */
  public handler(handler: Handler): this {
    this.handlers.push(handler);

    return this;
  }

  /**
   * @param handlers The handlers that will be chained together.
   * @returns The first handler in the chain.
   */
  protected createChain() {
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
}
