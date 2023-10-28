import { Handler } from "../../core/Handler.ts";

export type ContextHandlerFunction = (context: any) => any;

export class HandleFnHandler extends Handler {
  protected handlerFn: ContextHandlerFunction;

  constructor(handleFn: ContextHandlerFunction) {
    super();
    this.handlerFn = handleFn;
  }

  handle(context: any) {
    return Promise
      .resolve()
      .then(() => this.handlerFn(context))
      .then((returnedContext) => super.sendToNextHandler(returnedContext));
  }
}
