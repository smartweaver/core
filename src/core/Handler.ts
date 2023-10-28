export class Handler {
  protected next_handler: Handler | null = null;

  /**
   * Handle the context.
   * @param context An object containing the data passed between each handler.
   * @returns The context.
   */
  public handle(context: any): any {
    return Promise
      .resolve()
      .then(() => {
        // If this handler is part of a chain, then call the next handler
        if (this.next_handler) {
          return this.next_handler.handle(context);
        }

        // Otherwise, return the context back to the caller of the chain's first
        // handler
        return context;
      });
  }

  /**
   * A convenience method so extended handlers can be written succintly. See
   * example.
   * @param context An object containing the data passed between each handler.
   * @returns The context.
   *
   * @example
   * ```ts
   * class MyHandler extends AbstractHandler {
   *   handle(context: Context): Promise<Context> {
   *     if (!context.something) {
   *       super.sendToNextHandler(context;)
   *     }
   *   }
   * }
   * ```
   */
  public sendToNextHandler<C>(context: C): Promise<C> {
    return Promise
      .resolve()
      .then(() => {
        if (this.next_handler !== null) {
          return this.next_handler.handle(context) as Promise<C>;
        }

        return context;
      });
  }

  /**
   * Set this handler's next handler.
   * @param nextHandler The handler to use if `super.sendToNextHandler()` is called.
   * @returns The given next handler
   */
  public setNextHandler(nextHandler: Handler) {
    this.next_handler = nextHandler;
    return nextHandler;
  }
}
