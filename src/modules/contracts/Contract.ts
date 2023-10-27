import { Contract as CoreContract } from "../../core/Contract.ts";
import { AbstractChainBuilder } from "../../core/AbstractChainBuilder.ts";
import { Context, HandlerFn, KeyValues } from "./types.ts";
import { Handler } from "../../core/Handler.ts";
import { WrappedHandleFnHandler } from "../../core/WrappedHandleFnHandler.ts";

interface WithFunctionName extends Handler {
  readonly function: string;
}

// Hide `handler` for semantics from an API consumption point of view
export type ContractBuilder<S = {}> = Omit<Builder<S>, "handler">;

class HandlerProxy extends WrappedHandleFnHandler {
  readonly function;

  constructor(fn: string, handleFn: HandlerFn) {
    super(handleFn);
    this.function = fn;
  }

  handle(context: any) {
    const incomingFunction = context.interaction.input.function;

    if (incomingFunction !== this.function) {
      if (this.next_handler) {
        return super.sendToNextHandler(context);
      }

      // If there is no next handler, then this function must not be registered
      // in the contract, so throw an error.
      throw new Error(
        `Function '${incomingFunction}' unknown`,
      );
    }

    return this.handlerFn(context);
  }
}

/**
 * The builder for the `Contract` object.
 */
class Builder<S extends KeyValues<S>> extends AbstractChainBuilder {
  protected contract_state: S | {}; // TODO(crookse) Implement. Currently used for type inferrence.

  constructor(state?: S) {
    super();
    this.contract_state = state || {};
  }

  /**
   * Set the contract's initial state.
   * @param initialState The contract's initial state.
   * @returns This builder for further method chaining.
   */
  initialState<S>(initialState: KeyValues<S>): ContractBuilder<S> {
    return new Builder<S>(initialState);
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
    action: WithFunctionName | string,
    handler?: (context: Context<S>) => Context<S> | Promise<Context<S>>,
  ): ContractBuilder<S> {
    if (typeof action !== "string") {
      return super.handler(
        new HandlerProxy(
          action.function,
          (context) => action.handle(context),
        ),
      );
    }

    if (!handler) {
      throw new Error(
        `Cannot create an interaction handler without a handler function`,
      );
    }

    return super.handler(new HandlerProxy(action, handler));
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
    return new Contract(this.createChain());
  }
}

export class Contract extends CoreContract {
  static builder(): ContractBuilder<{}> {
    return new Builder();
  }
}
