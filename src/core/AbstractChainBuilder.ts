import { Handler } from "./types.ts";

export abstract class AbstractChainBuilder {
  protected handlers: Handler[] = [];

  abstract build(): unknown;

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

    this.handlers.reduce((previous, current) => {
      return previous.setNextHandler(current);
    });

    return this.handlers[0];
  }
}
