import { HandlerWithAction } from "../../HandlerWithAction";
import { HandlerFn } from "../types";

export class WrappedHandleFnHandler extends HandlerWithAction {
  protected handlerFn: HandlerFn;

  constructor(action: string, handleFn: HandlerFn) {
    super(action);
    this.handlerFn = handleFn;
  }

  handle(context: any) {
    return this.handlerFn(context);
  }
}
