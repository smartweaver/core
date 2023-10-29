import { Handler } from "../../core/handlers/Handler.ts";
import { AbstractChainBuilder } from "../../core/chains/AbstractChainBuilder.ts";

class ChainBuilder extends AbstractChainBuilder<Handler> {
  /**
   * Build the chain -- linking all handlers in sequential order.
   * @returns The first handler.
   */
  build() {
    if (!this.handlers) {
      throw new Error("Chain.Builder: `this.handlers` should be an array");
    }

    if (!this.handlers.length) {
      throw new Error("Chain.Builder: `this.handlers` is empty");
    }

    return {
      handle: <R>(context: any): Promise<R> => {
        for (const handler of this.handlers) {
          handler.handle(context);
        }

        return context;
      },
    };
  }
}

export class IsolatedHandlerChain {
  #chain_builder: ChainBuilder = new ChainBuilder();

  build() {
    const chain = this.#chain_builder.build();

    return {
      handle: <R = any, C = any>(context: C): Promise<R> => {
        return chain.handle(context);
      },
    };
  }
}
