import { Handler } from "./Handler.ts";

export type HandlerFn<I = any, O = any> = (input: I) => O | Promise<O>;

export class WrappedHandleFnHandler extends Handler {
  protected handlerFn: HandlerFn;

  constructor(handleFn: HandlerFn) {
    super();
    this.handlerFn = handleFn;
  }

  handle(context: any) {
    return Promise
      .resolve()
      .then(() => this.handlerFn(context))
      .then((c) => super.sendToNextHandler(c));
  }
}
