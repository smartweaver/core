import { ChainWithContractMembers } from './chains/ChainWithContractMembers.js';
import { Handler } from './handlers/Handler.js';
export { Context as ContractContext } from './types/Context.js';
import '../../../core/Handler.js';
import '../../base/IsolatedHandlerChain.js';
import '../../../core/AbstractChainBuilder.js';
import './handlers/HandlerProxy.js';
import '../../base/AnonymousFnHandler.js';

declare class Contract {
    /**
     * Handler class that should be extended and used by users of the `Contract`.
     * To ensure this contract handles all handlers properly, handlers should be
     * of this handler type.
     */
    static readonly Handler: typeof Handler;
    static builder(): ChainWithContractMembers<{}>;
}

export { Contract };
