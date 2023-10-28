import { Handler } from "../../core/Handler.js";
import { AbstractChainBuilder } from "../../core/AbstractChainBuilder.js";

type FirstHandler<C> = {
  handle: <R = any>(context: C) => Promise<R>;
};
declare class ChainBuilder extends AbstractChainBuilder {
  build(): Handler;
}
declare class Chain {
  protected chain_builder: ChainBuilder;
  build<HandleMethodContext = any>(): FirstHandler<HandleMethodContext>;
}

export { Chain, FirstHandler };
