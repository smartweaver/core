import { Handler } from '../../core/Handler.js';

declare class NextableHandler implements Handler {
    protected next_handler: Handler | null;
    handle(context: any): Promise<any>;
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
    next(context: any): Promise<any>;
    /**
     * Set this handler's next handler.
     * @param nextHandler The handler to use if `super.next()` is called.
     * @returns The given next handler
     */
    setNextHandler(nextHandler: NextableHandler): NextableHandler;
}

export { NextableHandler };
