import {
  ContextHandlerFunction,
  HandleFnHandler,
} from "../../../base/HandleFnHandler.ts";
import { ContextShapeValidator } from "../validators/ContextShapeValidator.ts";

export interface HandlerWithFunctionName {
  function_name: string;
  handle(context: any): any;
}

export class HandlerProxy extends HandleFnHandler {
  readonly function_name;

  constructor(fn: string, handleFn: ContextHandlerFunction) {
    super(handleFn);
    this.function_name = fn;
    this.#modifyMemberNames()
  }

  handle(context: any) {
    return Promise
      .resolve()
      .then(() => ContextShapeValidator.validate(context))
      .then((validatedContext) => {
        const incomingFn = validatedContext.action.input.function;
        if (incomingFn !== this.function_name) {
          return super.sendToNextHandler(validatedContext);
        }

        return validatedContext;
      })
      .then((validatedContext) => this.handlerFn(validatedContext));
  }

  /**
   * Modify this object's members' names (for debugging purposes).
   */
  #modifyMemberNames() {
    Object.defineProperty(this.constructor, "name", {
      value: `${this.constructor.name}__${this.function_name}__`,
    });
    Object.defineProperty(this.handlerFn, "name", {
      value: `anonymous__${this.function_name}__`,
    });
  }
}
