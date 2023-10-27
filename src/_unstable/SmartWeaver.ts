import { Recursive } from "./types";

namespace SmartWeaver {
  /**
   * @template Wrappee The type of the plain state JSON object being wrapped.
   *
   * A decorator to a contract's plain state JSON object.
   *
   * This decorator is intended to be used via the decorator design pattern, not
   * the `@` annotation. It wraps the the plain state JSON object to make it
   * interactable.
   */
  interface Store<State> {
    // new <Wrappee>(s: string, hello: string): boolean;

    /**
     * The contract's plain state object. This is the object that should be
     * wrapped by the implementer of this interface. It should be read-only to
     * ensure users do not modify it through ways outside of this interface.
     */
    readonly initial_state: State;

    /**
     * @returns The result of calling `JSON.parse(JSON.stringify(this.state))`.
     */
    json(): Recursive<State>;

    /**
     * @returns A text representation of the state's fields.
     */
    text(): string;
  }
}
