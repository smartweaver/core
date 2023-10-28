import { ApiConfig } from 'arweave/node/lib/api';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateTransactionInterface } from 'arweave/node/common';

type DeployChainHandler = {
    handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};
type HandleMethodContext = {
    /**
     * The data to use to sign the source code and contract transactions.
     */
    creator: JWKInterface | "use_wallet";
    /**
     * The data to help create the source code transaction.
     */
    source_code: Partial<CreateTransactionInterface>;
    /**
     * The data to help create the source code transaction.
     */
    initial_state: Partial<CreateTransactionInterface>;
};
type DeployChainCreateOptions = {
    /**
     * Configs to pass to {@linkcode Arweave.init}.
     */
    api_config?: ApiConfig;
};
type HandlerOutput = {
    /**
     * The contract's source code transaction's ID.
     */
    source_code_id: string;
    /**
     * The contract transaction's ID.
     */
    contract_id: string;
};
declare class DeployChain {
    /**
     * Create a chain of handlers that result in creating a:
     * - contract source code transaction; and
     * - contract transaction.
     *
     * The term "deploy" is used to emphasize that the transactions will be
     * deployed to the network.
     *
     * @param options See {@linkcode DeployChainCreateOptions}
     * @returns The deploy chain's handler.
     *
     * @example
     * ```
     * const chain = DeployChain.create({ api_config: { port: 1984 } });
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
     *     source_code: {
     *       data: "export function handle(state, action) { ... }",
     *     },
     *     initial_state: {
     *       data: JSON.stringify({}),
     *     },
     *   });
     * ```
     */
    static create(options: DeployChainCreateOptions): DeployChainHandler;
}

export { DeployChain, DeployChainCreateOptions, HandlerOutput };
