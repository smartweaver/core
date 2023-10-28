import {
  ContextHandlerFunction,
  HandleFnHandler,
} from "../../../base/HandleFnHandler.js";
import "../../../../core/Handler.js";

interface HandlerWithFunctionName {
  function_name: string;
  handle(context: any): any;
}
declare class HandlerProxy extends HandleFnHandler {
  readonly function_name: string;
  readonly metadata: {
    name: string;
  };
  constructor(fn: string, handleFn: ContextHandlerFunction);
  handle(context: any): Promise<any>;
}

export { HandlerProxy, HandlerWithFunctionName };
