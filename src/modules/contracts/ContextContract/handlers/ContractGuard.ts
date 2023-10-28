import { Handler } from "../../../../core/Handler.ts";
import { ContextShapeValidator } from "../validators/ContextShapeValidator.ts";
import { Context } from "../types/Context.ts";

export class ContractGuard<S> extends Handler {
    /**
     * All functions this contract can handle.
     */
    readonly functions: string[];
  
    constructor(functions: string[]) {
      super();
      this.functions = functions;
    }
  
    /**
     * Handle the incoming context and return it back to the caller with or
     * without modifications. The caller is responsible for handling the context
     * object further.
     * @param context
     * @returns The resulting state.
     */
    handle<C>(context: C & Context<S>): Promise<Context<S>> {
      return Promise
        .resolve()
        .then(() => ContextShapeValidator.validate(context))
        .then(() => {
          if (!this.functions || !this.functions.length) {
            throw new Error(`Contract does not have functions defined`);
          }
  
          const incomingFunction = context.action.input.function;
          
          if (!this.functions.includes(incomingFunction)) {
            throw new Error(`Unknown function '${incomingFunction}' provided`);
          }
        })
        .then(() => super.sendToNextHandler(context));
    }
  }
  