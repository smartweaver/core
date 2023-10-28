import { ChainWithContractMembers } from "./chains/ChainWithContractMembers.ts";
import { Handler } from "./handlers/Handler.ts";

export { Context as ContractContext} from "./types/Context.ts";

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
