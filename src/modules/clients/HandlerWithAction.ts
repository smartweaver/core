import { Handler as CoreHandler } from "../../../src/core/Handler.ts";

export class HandlerWithAction extends CoreHandler {
  readonly action: string;
  constructor(action: string) {
    super();
    this.action = action;
  }
}
