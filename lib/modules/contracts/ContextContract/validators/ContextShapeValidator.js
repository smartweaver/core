// src/modules/contracts/ContextContract/validators/ContextShapeValidator.ts
var ContextShapeValidator = class {
  /**
   * Validate that the given `context` is in a shape expected by contracts.
   * @param context The context in question.
   */
  static validate(context) {
    if (!context) {
      throw new Error(`Unexpected missing \`context\` object`);
    }
    if (typeof context !== "object") {
      throw new Error(`Argument 'context' should be an object`);
    }
    if (
      !("action" in context) || !context.action ||
      typeof context.action !== "object"
    ) {
      throw new Error(
        `Field 'context.action' should be an object`,
      );
    }
    if (
      !("input" in context.action) || !context.action.input ||
      typeof context.action.input !== "object"
    ) {
      throw new Error(
        `Field 'context.action.input' should be an object`,
      );
    }
    if (
      !("function" in context.action.input) || !context.action.input.function ||
      typeof context.action.input.function !== "string"
    ) {
      throw new Error(
        `Field 'context.action.input.function' should be a string`,
      );
    }
    return context;
  }
};

export { ContextShapeValidator };
