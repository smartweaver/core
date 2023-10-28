import { Handler as CoreHandler } from "../../../../core/Handler.ts";

export abstract class Handler implements CoreHandler {
  readonly function_name: string;

  constructor(functionName: string) {
    this.function_name = functionName;
  }

  abstract handle(context: any): any;
}
