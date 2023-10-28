import { Handler } from "../../core/Handler.js";

type ContextHandlerFunction = (context: any) => any;
declare class HandleFnHandler extends Handler {
  protected handlerFn: ContextHandlerFunction;
  constructor(handleFn: ContextHandlerFunction);
  handle(context: any): Promise<any>;
}

export { ContextHandlerFunction, HandleFnHandler };
