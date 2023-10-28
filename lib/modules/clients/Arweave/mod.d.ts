import { ViewerChainCreateOptions, HandlerOutput as HandlerOutput$2 } from './chains/ViewerChain.js';
import { ReaderChainCreateOptions, HandlerOutput as HandlerOutput$1 } from './chains/ReaderChain.js';
import { DeployChainCreateOptions, HandlerOutput } from './chains/DeployChain.js';
import * as arweave_node_common from 'arweave/node/common';
import * as arweave_node_lib_wallet from 'arweave/node/lib/wallet';
import { WriterChainCreateOptions } from './chains/WriterChain.js';
import { ChainWithUseMethod } from './chains/ChainWithUseMethod.js';
import 'arweave/node/lib/api';
import './handlers/SmartWeaveContractViewer.js';
import './handlers/ArweaveHandler.js';
import 'arweave';
import '../../base/NextableHandler.js';
import '../../../core/Handler.js';
import './handlers/SmartWeaveContractInteractReader.js';
import 'arweave/node/lib/transaction';
import '../../base/AnonymousFnHandler.js';
import '../../base/NextableHandlerChain.js';

declare class Client {
    static builder(): ChainWithUseMethod;
    /**
     * Relay method for {@linkcode DeployChain.create}.
     *
     * @see {@linkcode DeployChain.create} for more information.
     */
    static deployer(options: DeployChainCreateOptions): {
        handle<R>(context: {
            creator: arweave_node_lib_wallet.JWKInterface | "use_wallet";
            source_code: Partial<arweave_node_common.CreateTransactionInterface>;
            initial_state: Partial<arweave_node_common.CreateTransactionInterface>;
        }): Promise<HandlerOutput & R>;
    };
    /**
     * Relay method for {@linkcode ReaderChain.create}.
     *
     * @see {@linkcode ReaderChain.create} for more information.
     */
    static reader(options: ReaderChainCreateOptions): {
        handle<R>(context: {
            creator?: arweave_node_lib_wallet.JWKInterface | "use_wallet" | undefined;
            contract_id: string;
            input?: any;
            tags?: Record<string, string> | undefined;
            target?: string | undefined;
            winston_qty?: string | undefined;
        }): Promise<HandlerOutput$1 & R>;
    };
    /**
     * Relay method for {@linkcode ViewerChain.create}.
     *
     * @see {@linkcode ViewerChain.create} for more information.
     */
    static viewer(options: ViewerChainCreateOptions): {
        handle<R>(context: {
            contract_id: string;
            height?: number | undefined;
            return_validity?: boolean | undefined;
        }): Promise<HandlerOutput$2 & R>;
    };
    /**
     * Relay method for {@linkcode WriterChain.create}.
     *
     * @see {@linkcode WriterChain.create} for more information.
     */
    static writer(options: WriterChainCreateOptions): {
        handle: <R = any, C = any>(context: C) => Promise<R>;
    };
}

export { Client };
