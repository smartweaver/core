import { AnonymousFn } from '../../../base/AnonymousFnHandler.js';
import { NextableHandler } from '../../../base/NextableHandler.js';
import { NextableHandlerChain } from '../../../base/NextableHandlerChain.js';
import '../../../../core/Handler.js';

type AllowedHandlers = AnonymousFn | NextableHandler;
declare class ChainWithUseMethod extends NextableHandlerChain {
    #private;
    /**
     * Use the given `handler` in this chain.
     *
     * @param handler The handler in question.
     * @returns This instance for further method chaining.
     */
    use(handler: AllowedHandlers): this;
}

export { ChainWithUseMethod };
