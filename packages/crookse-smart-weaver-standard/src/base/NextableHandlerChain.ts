import { AbstractChainBuilder } from "@crookse/smart-weaver-core/src/chains/AbstractChainBuilder";
import { NextableHandler } from "./NextableHandler";

export type FirstHandler<C> = { handle: <R = any>(context: C) => Promise<R> };

class ChainBuilder extends AbstractChainBuilder<NextableHandler> {
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
}

export class NextableHandlerChain {
  /**
   * TODO(crookse) Make succint.
   * This class hides the actual chain builder so the exposed members are
   * controlled by the extending class.
   */
  #chain_builder = new ChainBuilder();

  protected handler(handler: NextableHandler) {
    this.#chain_builder.handler(handler);
    return this;
  }

  build() {
    const chain = this.#chain_builder.build();

    return {
      handle: <R = any, C = any>(context: C): Promise<R> => {
        return chain.handle(context);
      },
    };
  }
}
