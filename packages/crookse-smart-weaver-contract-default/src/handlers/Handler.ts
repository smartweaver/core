import { Handler as CoreHandler } from "@crookse/smart-weaver-core/src/handlers/Handler.js";

export abstract class Handler implements CoreHandler {
  readonly function_name: string;

  constructor(functionName: string) {
    this.function_name = functionName;
  }

  abstract handle(context: any): any;
}
