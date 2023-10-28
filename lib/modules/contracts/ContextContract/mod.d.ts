import { Handler } from "../../../core/Handler.js";
import { ChainWithContractMembers } from "./chains/ChainWithContractMembers.js";
import "../../base/Chain.js";
import "../../../core/AbstractChainBuilder.js";
import "./handlers/HandlerProxy.js";
import "../../base/HandleFnHandler.js";
import "./types/Context.js";

declare class Contract {
  /**
   * Handler class that should be extended and used by users of the `Contract`.
   * To ensure this contract handles all handlers properly, handlers should be
   * of this handler type.
   */
  static readonly Handler: typeof Handler;
  static builder(): ChainWithContractMembers<{}>;
}

export { Contract };
