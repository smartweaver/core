import { Handler } from "@crookse/smart-weaver-core/src/handlers/Handler";

export class NextableHandler implements Handler {
  protected next_handler: Handler | null = null;

  public handle(context: any) {
    return this.next(context);
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
   *       super.next(context;)
   *     }
   *   }
   * }
   * ```
   */
  public next(context: any) {
    return Promise
      .resolve()
      .then(() => {
        if (this.next_handler !== null) {
          return this.next_handler.handle(context);
        }

        return context;
      });
  }

  /**
   * Set this handler's next handler.
   * @param nextHandler The handler to use if `super.next()` is called.
   * @returns The given next handler
   */
  public setNextHandler(nextHandler: NextableHandler) {
    this.next_handler = nextHandler;
    return nextHandler;
  }
}
