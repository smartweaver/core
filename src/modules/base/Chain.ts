import { AbstractChainBuilder } from "../../core/AbstractChainBuilder.ts";

export type FirstHandler<C> = { handle: <R = any>(context: C) => Promise<R> };

class ChainBuilder extends AbstractChainBuilder {
  build() {
    return this.createChain();
  }
}

export class Chain {
  protected chain_builder: ChainBuilder = new ChainBuilder();

  build<HandleMethodContext = any>(): FirstHandler<HandleMethodContext> {
    const chain = this.chain_builder.build();
    return chain;
  }
}
