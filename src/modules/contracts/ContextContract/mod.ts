import { Handler } from "../../../core/Handler.ts";
import { ChainWithContractMembers } from "./chains/ChainWithContractMembers.ts";

export class Contract {
  /**
   * Handler class that should be extended and used by users of the `Contract`.
   * To ensure this contract handles all handlers properly, handlers should be
   * of this handler type.
   */
  static readonly Handler = Handler;

  static builder() {
    return new ChainWithContractMembers();
  }
}
