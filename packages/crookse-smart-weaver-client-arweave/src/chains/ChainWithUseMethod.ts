import { AnonymousFn } from "@crookse/smart-weaver-standard/src/base/AnonymousFnHandler";
import { NextableHandler } from "@crookse/smart-weaver-standard/src/base/NextableHandler";
import { NextableHandlerChain } from "@crookse/smart-weaver-standard/src/base/NextableHandlerChain";

type AllowedHandlers = AnonymousFn | NextableHandler;

export class ChainWithUseMethod extends NextableHandlerChain {
  /**
   * Use the given `handler` in this chain.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  use(handler: AllowedHandlers) {
    return this.#addHandlerToChain(handler);
  }

  /**
   * Add the given `handler` to the chain. This method is not exposed to the
   * public API reads as `Chain.builder().use(...).use(...).build()`.
   *
   * @param handler The handler in question.
   * @returns This instance for further method chaining.
   */
  #addHandlerToChain(handler: AllowedHandlers): this {
    if (handler instanceof NextableHandler) {
      this.handler(handler);
      return this;
    }

    this.handler(new AnonymousFnHandlerProxy(handler));
    return this;
  }
}

class AnonymousFnHandlerProxy extends NextableHandler {
  protected handleFn: AnonymousFn;

  constructor(handleFn: AnonymousFn) {
    super();
    this.handleFn = handleFn;
  }

  public handle(context: any): Promise<any> {
    return Promise
      .resolve()
      .then(() => this.handleFn(context))
      .then((returnedContext) => super.next(returnedContext));
  }
}
