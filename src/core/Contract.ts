import { Context } from "./Context.ts";
import { Handler } from "./types.ts";

export class Contract {
  protected chain: Handler;

  constructor(chain: Handler) {
    this.chain = chain;
  }

  /**
   * Handle the incoming context and return it back to the caller with or
   * without modifications. The caller is responsible for handling the context
   * object further.
   * @param incomingContext
   * @returns The resulting state.
   */
  handle<C extends Context<unknown>>(context: C): Promise<C> {
    return Promise
      .resolve()
      .then(() => this.validate(context))
      .then(() => {
        if (!this.chain) {
          throw new Error(`Contract does not have functions defined`);
        }

        return this.chain!.handle(context) as Promise<C>;
      });
  }

  protected validate(context: unknown) {
    if (
      !context ||
      typeof context !== "object"
    ) {
      throw new Error(`Argument 'context' should be an object`);
    }

    if (
      !("interaction" in context) ||
      !context.interaction ||
      (typeof context.interaction !== "object")
    ) {
      throw new Error(
        `Field 'context.interaction' should be an object`,
      );
    }

    if (
      !("input" in context.interaction) ||
      !context.interaction.input ||
      (typeof context.interaction.input !== "object")
    ) {
      throw new Error(
        `Field 'context.interaction.input' should be an object`,
      );
    }

    if (
      !("function" in context.interaction.input) ||
      !context.interaction.input.function ||
      (typeof context.interaction.input.function !== "string")
    ) {
      throw new Error(
        `Field 'context.interaction.input.function' should be an string`,
      );
    }
  }
}
