import { HandlerWithAction } from "./HandlerWithAction";

export type HandlerFn<I = any, O = any> = (input: I) => O | Promise<O>;

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

class Builder {
  #handlers: HandlerWithAction[] = [];

  deployer(handler: HandlerFn) {
    return this.#addHandler("deploy", handler);
  }

  reader(handler: HandlerFn) {
    return this.#addHandler("read", handler);
  }

  writer(handler: HandlerFn) {
    return this.#addHandler("write", handler);
  }

  evolver(handler: HandlerFn) {
    return this.#addHandler("evolve", handler);
  }

  #addHandler(name: string, handler: HandlerFn): this {
    this.#handlers.push(new WrappedHandleFnHandler(name, handler));
    return this;
  }

  build() {
    return new Client(this.#handlers);
  }
}

export class Client {
  static readonly Builder = Builder;

  protected functions: string[];
  protected handlers: Record<string, HandlerWithAction> = {};

  constructor(handlers: HandlerWithAction[]) {
    // Create the list of functions this contract can handle
    this.functions = handlers
      .slice()
      .map((handler) => handler.action);

    // Store the handlers in key-value format so they are easy/quick to find
    handlers.forEach((handler) => {
      this.handlers[handler.action] = handler;
    });
  }

  read<R>(options: any): Promise<R> {
    return this.handle({ action: "read", options });
  }

  deploy<R>(options: any): Promise<R> {
    return this.handle({ action: "deploy", options });
  }

  write<R>(options: any): Promise<R> {
    return this.handle({ action: "write", options });
  }

  evolve<R>(options: any): Promise<R> {
    return this.handle({ action: "evolve", options });
  }

  /**
   * Handle the context and return it back to the caller with or without
   * modifications. The caller is responsible for handling the context object
   * further.
   * @param context
   * @returns The context.
   */
  protected handle(context: any): Promise<any> {
    return Promise
      .resolve()
      .then(() => this.validate(context))
      .then((action) => this.handlers[action].handle(context.options));
  }

  /**
   * Validate that the context can be used by this client.
   * @param context The context in question.
   * @returns The action this client should take to further process the context.
   */
  protected validate(context: unknown): string {
    if (!this.handlers || !Object.keys(this.handlers).length) {
      throw new Error(`Contract does not have functions defined`);
    }

    if (
      !context ||
      typeof context !== "object"
    ) {
      throw new Error(`Argument 'context' should be an object`);
    }

    if (
      !("action" in context) ||
      !context.action ||
      (typeof context.action !== "string")
    ) {
      throw new Error(
        `Field 'context.action' should be a string`,
      );
    }

    return context.action;
  }
}
