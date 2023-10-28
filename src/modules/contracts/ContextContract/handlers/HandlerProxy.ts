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
  readonly metadata;

  constructor(fn: string, handleFn: ContextHandlerFunction) {
    super(handleFn);
    this.function_name = fn;
    this.metadata = {
      name: `__HandlerProxy__${fn}`
    }
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
      .then((validatedContext) => {
        const c = this.handlerFn(validatedContext)
        return c;
      })
  }
}
