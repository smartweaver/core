import { ApiConfig } from 'arweave/node/lib/api';
import { SmartWeaveContractInteractReader } from '../handlers/SmartWeaveContractInteractReader.js';
import 'arweave/node/lib/wallet';
import '../handlers/ArweaveHandler.js';
import 'arweave';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type ReaderChainHandler = {
    handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};
type HandleMethodContext = Parameters<SmartWeaveContractInteractReader["handle"]>[0];
type ReaderChainCreateOptions = {
    /**
     * Configs to pass to {@linkcode Arweave.init}.
     */
    api_config?: ApiConfig;
};
type HandlerOutput = {
    /**
     * The result of the read operation.
     */
    read_result: any;
};
declare class ReaderChain {
    /**
     * Create a chain of handlers that result in creating an "interaction"
     * transaction on a contract.
     *
     * @param options See {@linkcode ReaderChainCreateOptions}
     * @returns The writer chain's handler.
     *
     * @example
     * ```
     * const chain = ReaderChain.create({ api_config: { port: 1984 } });
     *
     * const result = await client
     *   .handle<{
     *     interaction_transaction: Transaction;
     *   }>({
     *     creator: {
     *       kty: "",
     *       n: "",
     *       e: "",
     *       d: "",
     *       p: "",
     *       q: "",
     *       dp: "",
     *       dq: "",
     *       qi: ""
     *     },
     *     contract_id: "",
     *     input: { function: "greet", payload: { message: "Hello" } }
     *   });
     * ```
     */
    static create(options: ReaderChainCreateOptions): ReaderChainHandler;
}

export { HandlerOutput, ReaderChain, ReaderChainCreateOptions };
