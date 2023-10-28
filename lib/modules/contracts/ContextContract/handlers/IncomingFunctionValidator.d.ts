import { Handler } from "../../../../core/Handler.js";
import { Context } from "../types/Context.js";

declare class IncomingFunctionValidator<S> extends Handler {
  /**
   * All functions this contract can handle.
   */
  readonly functions: string[];
  constructor(functions: string[]);
  /**
   * Check that the incoming context can be handled.
   * @param context
   * @returns The resulting state.
   */
  handle<C>(context: C & Context<S>): Promise<Context<S>>;
}

export { IncomingFunctionValidator };
