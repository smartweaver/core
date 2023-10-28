import { Handler } from '../../../../core/Handler.js';
import { IsolatedHandlerChain } from '../../../base/IsolatedHandlerChain.js';
import { HandlerWithFunctionName } from '../handlers/HandlerProxy.js';
import { Context } from '../types/Context.js';
import '../../../../core/AbstractChainBuilder.js';
import '../../../base/AnonymousFnHandler.js';

type KeyValues<O = {}> = {
    [K in keyof O]: O[K];
};
type ActionHandler = Handler | HandlerWithFunctionName;
/**
 * The builder for the `Contract` object.
 */
declare class ChainWithContractMembers<S extends KeyValues<S>> extends IsolatedHandlerChain {
    #private;
    protected contract_state: S | {};
    protected handlers: ActionHandler[];
    get functions(): string[];
    constructor(state?: S);
    /**
     * Set the contract's initial state.
     * @param initialState The contract's initial state.
     * @returns This builder for further method chaining.
     */
    initialState<S>(initialState: KeyValues<S>): ChainWithContractMembers<S>;
    /**
     * Add an interaction handler to the contract. Interaction handlers evaluate
     * the `state` and `interaction` objects received from the network and can
     * modify the state based on the data sent in the `interaction` object.
     * @param fnName The name of the function the handler handles.
     * @param handler The interaction handler.
     * @returns This builder.
     */
    action(fn: ActionHandler | string, handler?: (context: Context<S>) => Context<S> | Promise<Context<S>>): ChainWithContractMembers<S>;
    /**
     * Build the contract that can handle state and interactions.
     *
     * @returns A `Contract` instance. Its only method is `handle()`, which should
     * be used to pass the `state` and `interaction` objects received from the
     * network. These objects should be wrapped in a single object known as the
     * `context` object in this library. See example.
     *
     * @example
     * ```ts
     * const contract = Contract.builder().build();
     *
     * export function handle(state, interaction) {
     *   return contract
     *     .handle({ state, interaction }) // Put the `state` and `interaction` into a single object. This will be the `context` object.
     *     .then((context) => {
     *       return { state: context.state };
     *     })
     *     .catch((e) => {
     *       throw new ContractError(e.message ?? "We hit an error");
     *     });
     * }
     * ```
     */
    build<HandleMethodContext = {
        state: S;
        action: any;
    }>(): {
        functions: string[];
        handle: <R = {
            state: S;
        }>(context: HandleMethodContext) => Promise<R>;
    };
}

export { ChainWithContractMembers };
