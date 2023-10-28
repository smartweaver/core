import { ApiConfig } from 'arweave/node/lib/api';
import Transaction from 'arweave/node/lib/transaction';

type WriterChainCreateOptions = {
    /**
     * Configs to pass to {@linkcode Arweave.init}.
     */
    api_config?: ApiConfig;
};
type HandlerOutput = {
    /**
     * The transaction object representing the interaction transaction.
     */
    interaction_transaction: Transaction;
};
declare class WriterChain {
    /**
     * Create a chain of handlers that result in creating an "interaction"
     * transaction on a contract.
     *
     * @param options See {@linkcode WriterChainCreateOptions}
     * @returns The writer chain's handler.
     *
     * @example
     * ```
     * const chain = WriterChain.create({ api_config: { port: 1984 } });
     *
     * const result = await chain
     *   .handle({
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
    static create(options: WriterChainCreateOptions): {
        handle: <R = any, C = any>(context: C) => Promise<R>;
    };
}

export { HandlerOutput, WriterChain, WriterChainCreateOptions };
