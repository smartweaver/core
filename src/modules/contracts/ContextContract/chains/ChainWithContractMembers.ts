import { Handler } from "../../../../core/Handler.ts";
import { Chain } from "../../../base/Chain.ts";
import { IncomingFunctionValidator } from "../handlers/IncomingFunctionValidator.ts";
import { HandlerProxy, HandlerWithFunctionName } from "../handlers/HandlerProxy.ts";
import { Context } from "../types/Context.ts";

type KeyValues<O = {}> = { [K in keyof O]: O[K] };

type ActionHandler = Handler | HandlerWithFunctionName;

/**
 * The builder for the `Contract` object.
 */
export class ChainWithContractMembers<S extends KeyValues<S>> extends Chain {
    // TODO(crookse) Implement. Currently used for type inferrence.
    protected contract_state: S | {};
    protected handlers: ActionHandler[] = [];
    #functions: string[] = [];

    get functions() {
        return this.#functions;
    }
  
    constructor(state?: S) {
      super();
      this.contract_state = state || {};
    }
  
    /**
     * Set the contract's initial state.
     * @param initialState The contract's initial state.
     * @returns This builder for further method chaining.
     */
    initialState<S>(initialState: KeyValues<S>): ChainWithContractMembers<S> {
      // TODO(crookse) Infer without instantiating a new object
      return new ChainWithContractMembers<S>(initialState);
    }
  
    /**
     * Add an interaction handler to the contract. Interaction handlers evaluate
     * the `state` and `interaction` objects received from the network and can
     * modify the state based on the data sent in the `interaction` object.
     * @param fnName The name of the function the handler handles.
     * @param handler The interaction handler.
     * @returns This builder.
     */
    action(
      fn: ActionHandler | string,
      handler?: (context: Context<S>) => Context<S> | Promise<Context<S>>,
    ): ChainWithContractMembers<S> {
      if (typeof fn !== "string") {
  
        if (!("function_name" in fn)) {
          throw new Error(`Handler is missing 'function_name' property`);
        }
  
        if (!("handle" in fn)) {
          throw new Error(`Handler is missing 'handle()' method`);
        }

        // const wrappedHandler = new HandlerProxy(fn.function_name, ());

        // this.functions.push(fn.function_name)
        // this.chain_builder.handler(wrappedHandler);
        return this.action(fn.function_name, function (context) {
            return fn.handle(context);
        })
  
        // // If we received a handler class (e.g., `new SomeHandler()`), then take
        // // its name and handler method and pass it back to this method so it can
        // // be turned into the `HandlerProxy` object below
        // return this.action(
        //   fn.function_name,
        //   // Intentionally using `function (...)` to prevent `this` context from
        //   // leaking out into this `ChainWithContractMembers` object
        //   function (context) {
        //     const c = fn.handle(context);

        //     if (c.constructor && c.constructor.name && c.constructor.name === "Promise") {
        //         return c.then((c: any) => this.sendToNextHandler(c));
        //     }

        //     return Promise.resolve(c);
        //   },
        // );
      }
  
      // If no handler class was provided as the first argument, then we expect to
      // receive a callback function (e.g., `(context) => context`) here. If it
      // does not exist, then we cannot make this contract.
      if (!handler) {
        throw new Error(
          `Cannot create an interaction handler without a handler function`,
        );
      }
  
      this.functions.push(fn);
  
      const wrappedHandler = new HandlerProxy(fn, handler);
      this.chain_builder.handler(wrappedHandler);
  
      return this;
    }
  
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
    build<HandleMethodContext = { state: S, action: any }>() {
      const guard = new IncomingFunctionValidator(this.functions);

      const functions = this.functions;
      const firstHandler = super.build<HandleMethodContext>();

      return {
        functions,
        handle: <R = { state: S }>(context: HandleMethodContext): Promise<R> => {
            return Promise
                .resolve()
                // @ts-ignore Context objects don't match
                .then(() => guard.handle(context))
                .then(() => firstHandler.handle(context));
        }
      }
    }
  }
