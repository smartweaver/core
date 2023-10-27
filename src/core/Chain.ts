import { AbstractChainBuilder } from "./AbstractChainBuilder.ts";
import { HandlerFn, WrappedHandleFnHandler } from "./WrappedHandleFnHandler.ts";
import { Handler } from "./Handler.ts";

export type FirstHandler<C> = { handle: <R>(context: C) => Promise<R> };

class ChainBuilder extends AbstractChainBuilder {
  build<C>(): FirstHandler<C> {
    return this.createChain();
  }
}

export class Chain {
  protected chain_builder: ChainBuilder = new ChainBuilder();

  use(handler: HandlerFn | Handler) {
    return this.#addHandler(handler);
  }

  #addHandler(handler: HandlerFn | Handler): this {
    if (handler instanceof Handler) {
      this.chain_builder.handler(handler);
      return this;
    }

    this.chain_builder.handler(new WrappedHandleFnHandler(handler));
    return this;
  }

  build<C>() {
    return this.chain_builder.build<C>();
  }
}
