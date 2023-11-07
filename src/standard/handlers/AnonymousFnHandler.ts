import { Handler } from "../../handlers/Handler.ts";

export type AnonymousFn = (context: any) => any;

export class AnonymousFnHandler implements Handler {
  protected handlerFn: AnonymousFn;

  constructor(handleFn: AnonymousFn) {
    this.handlerFn = handleFn;
  }

  handle(context: any) {
    return Promise
      .resolve()
      .then(() => this.handlerFn(context));
  }
}
