import { AbstractChainBuilder } from "../../core/chains/AbstractChainBuilder.ts";
import { HandlerWithFunctionName } from "../handlers/HandlerWithFunctionName.ts";

class ChainBuilder extends AbstractChainBuilder<HandlerWithFunctionName> {
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

/**
 * This differs from the `NextableHandlerChain` because each handler in this
 * chain is looked up by their key.
 */
export class IsolatedHandlerChain {
  protected chain_builder: ChainBuilder = new ChainBuilder();

  build() {
    const chain = this.chain_builder.build();

    return {
      handle: <R = any, C = any>(context: C): Promise<R> => {
        return chain.handle(context);
      },
    };
  }
}
