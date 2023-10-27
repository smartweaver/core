export abstract class AbstractHandler {
  protected next_handler: AbstractHandler | null = null;

  setNextHandler(handler: AbstractHandler) {
    this.next_handler = handler;
    return this;
  }

  handle<C>(context: C): Promise<C> {
    return Promise
      .resolve()
      .then(() => {
        if (this.next_handler) {
          return this.next_handler.handle<C>(context);
        }

        throw new Error(`Unexpected end of function handlers`);
      });
  }
}
