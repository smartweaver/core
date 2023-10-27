// import { KeyValues } from "../types.ts";
// import { AbstractContract, ContractBuilder } from "./AbstractContract.ts";
// import { Handler } from "./Handler.ts";

// class Builder implements ContractBuilder {
//   protected contract_handlers: Handler[] = [];
//   protected contract_state: KeyValues;

//   constructor(state: KeyValues = {}) {
//     this.contract_state = state || {};
//   }

//   state(state: KeyValues) {
//     return new Builder(state);
//   }

//   /**
//    * @param functionName The name of the function that executes this action. This value
//    * is checked against the `interaction` object's `interaction.input.function`
//    * value
//    * @param handler
//    * @returns This builder.
//    */
//   interaction(handler: Handler): this {
//     this.contract_handlers.push(handler);

//     return this;
//   }

//   /**
//    * Build the contract that can handle state and interactions.
//    *
//    * @returns A `Contract` instance. Its only method is `handle()`, which should
//    * be used to pass the `state` and `interaction` objects to from the network.
//    * These objects are wrapped in a single object known as the `context` object
//    * in this library.
//    */
//   build() {
//     return new Contract(this.contract_state, this.contract_handlers);
//   }
// }

// export class Contract extends AbstractContract {
//   /**
//    * @returns The builder for this class.
//    */
//   static builder() {
//     return new Builder();
//   }

//   /**
//    * Handle the incoming context and return it back to the caller with or
//    * without modifications. The caller is responsible for handling the context
//    * object further.
//    * @param incomingContext
//    * @returns The resulting state.
//    */
//   handle<C>(context: C): Promise<C> {

//     return Promise
//       .resolve()
//       .then(() => this.#validate(context))
//       .then(() => this.chain.handle(context) as Promise<C>)
//       .then((result) => {
//         return result;
//       });
//   }

//   #validate(context: unknown) {
//     if (!this.handlers || !Object.keys(this.handlers).length) {
//       throw new Error(`Contract does not have functions defined`);
//     }

//     if (
//       !context ||
//       typeof context !== "object"
//     ) {
//       throw new Error(`Argument 'context' should be an object`);
//     }

//     if (
//       !("interaction" in context) ||
//       !context.interaction ||
//       (typeof context.interaction !== "object")
//     ) {
//       throw new Error(
//         `Field 'context.interaction' should be an object`,
//       );
//     }

//     if (
//       !("input" in context.interaction) ||
//       !context.interaction.input ||
//       (typeof context.interaction.input !== "object")
//     ) {
//       throw new Error(
//         `Field 'context.interaction.input' should be an object`,
//       );
//     }

//     if (
//       !("function" in context.interaction.input) ||
//       !context.interaction.input.function ||
//       (typeof context.interaction.input.function !== "string")
//     ) {
//       throw new Error(
//         `Field 'context.interaction.input.function' should be an string`,
//       );
//     }

//     const incomingFunction = context.interaction.input.function;
//     if (!(incomingFunction in this.handlers)) {
//       throw new Error(
//         `Unknown function '${incomingFunction}' provided. Allowed functions: ${
//           Object.keys(this.handlers).join(", ")
//         }`,
//       );
//     }

//     return incomingFunction;
//   }
// }
