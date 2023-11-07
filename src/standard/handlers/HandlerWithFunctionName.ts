import { Handler } from "../../handlers/Handler.ts";

export abstract class HandlerWithFunctionName implements Handler {
  readonly function_name: string;

  constructor(functionName: string) {
    this.function_name = functionName;
  }

  abstract handle(context: any): any;
}
