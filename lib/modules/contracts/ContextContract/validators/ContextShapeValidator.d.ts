import { Context } from "../types/Context.js";

declare class ContextShapeValidator {
  /**
   * Validate that the given `context` is in a shape expected by contracts.
   * @param context The context in question.
   */
  static validate(context: unknown): Context;
}

export { ContextShapeValidator };
