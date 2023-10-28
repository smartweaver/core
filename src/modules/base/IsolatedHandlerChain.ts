import { AbstractChainBuilder } from "@/src/core/AbstractChainBuilder.ts";
import { Handler } from "@/src/core/Handler.ts";

export type FirstHandler<C> = { handle: <R = any>(context: C) => Promise<R> };

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
  protected chain_builder: ChainBuilder = new ChainBuilder();

  build<
    HandleMethodContext = any,
  >(): FirstHandler<HandleMethodContext> {
    const chain = this.chain_builder.build();
    return chain;
  }
}
