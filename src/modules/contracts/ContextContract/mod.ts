import { AbstractChainBuilder } from "../../../core/AbstractChainBuilder.ts";
import { Handler } from "../../../core/Handler.ts";
import { Chain, FirstHandler } from "../../base/Chain.ts";
import { ContextShapeValidator } from "./validators/ContextShapeValidator.ts";
import {
  HandlerProxy,
  HandlerWithFunctionName,
} from "./handlers/HandlerProxy.ts";
import { Context } from "./types/Context.ts";
import { ContractGuard } from "./handlers/ContractGuard.ts";

type KeyValues<O = {}> = { [K in keyof O]: O[K] };

type InteractionHandler = Handler | HandlerWithFunctionName;

/**
 * The builder for the `Contract` object.
 */
class ContractChain<S extends KeyValues<S>> extends Chain {
  // TODO(crookse) Implement. Currently used for type inferrence.
  protected contract_state: S | {};
  protected handlers: InteractionHandler[] = [];
  protected functions: string[] = [];

  /**
   * Set the contract's initial state.
   * @param initialState The contract's initial state.
   * @returns This builder for further method chaining.
   */
  initialState<S>(initialState: KeyValues<S>): ContractChain<S> {
    // TODO(crookse) Infer without instantiating a new object
    return new ContractChain<S>(initialState);
  }

  /**
   * Add an interaction handler to the contract. Interaction handlers evaluate
   * the `state` and `interaction` objects received from the network and can
   * modify the state based on the data sent in the `interaction` object.
   * @param fnName The name of the function the handler handles.
   * @param handler The interaction handler.
   * @returns This builder.
   */
  interaction(
    fn: InteractionHandler | string,
    handler?: (context: Context<S>) => Context<S> | Promise<Context<S>>,
  ): ContractChain<S> {
    if (typeof fn !== "string") {

      if (!("function_name" in fn)) {
        throw new Error(`Handler is missing 'function_name' property`);
      }

      if (!("handle" in fn)) {
        throw new Error(`Handler is missing 'handle()' method`);
      }

      this.functions.push(fn.function_name);

      return this.interaction(
        fn.function_name,
        (context) => {
          return fn.handle(context);
        },
      );
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
    return super.use(wrappedHandler);
  }

  constructor(state?: S) {
    super();
    this.contract_state = state || {};
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
  build() {
    const firstHandler = new ContractGuard(this.functions);
    this.handlers = [firstHandler, ...this.handlers];
    return super.build();
  }
}

export class Contract {
  /**
   * Handler class that should be extended and used by users of the `Contract`.
   * To ensure this contract handles all handlers properly, handlers should be
   * of this handler type.
   */
  static readonly Handler = Handler;

  static builder() {
    return new ContractChain();
  }
}
