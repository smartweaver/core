import {
  AnonymousFn,
  AnonymousFnHandler,
} from "@/src/modules/base/AnonymousFnHandler.ts";
import { Context } from "../types/Context.ts";

export interface HandlerWithFunctionName {
  function_name: string;
  handle(context: any): any;
}

export class HandlerProxy extends AnonymousFnHandler {
  readonly function_name;
  readonly metadata;

  constructor(fn: string, handleFn: AnonymousFn) {
    super(handleFn);
    this.function_name = fn;
    this.metadata = {
      name: `__HandlerProxy__${fn}`,
    };
  }

  handle(context: Context) {
    return Promise
      .resolve()
      .then(() => {
        const incomingFn = context.action.input.function;

        if (incomingFn !== this.function_name) {
          return context;
        }

        return super.handle(context);
      });
  }
}
