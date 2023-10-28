import { Handler } from './Handler.js';

declare abstract class AbstractChainBuilder<H extends Handler = Handler> {
    /**
     * The handlers in this chain.
     */
    handlers: H[];
    /**
     * Build the chain.
     */
    abstract build(): unknown;
    /**
     * Add the given `handler` to this chain.
     * @param handler
     * @returns
     */
    handler(handler: H): this;
}

export { AbstractChainBuilder };
