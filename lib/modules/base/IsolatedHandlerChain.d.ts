import { AbstractChainBuilder } from '../../core/AbstractChainBuilder.js';
import { Handler } from '../../core/Handler.js';

type FirstHandler<C> = {
    handle: <R = any>(context: C) => Promise<R>;
};
declare class ChainBuilder extends AbstractChainBuilder<Handler> {
    /**
     * Build the chain -- linking all handlers in sequential order.
     * @returns The first handler.
     */
    build(): {
        handle: <R>(context: any) => Promise<R>;
    };
}
declare class IsolatedHandlerChain {
    protected chain_builder: ChainBuilder;
    build<HandleMethodContext = any>(): FirstHandler<HandleMethodContext>;
}

export { FirstHandler, IsolatedHandlerChain };
