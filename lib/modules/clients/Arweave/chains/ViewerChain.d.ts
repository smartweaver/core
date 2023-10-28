import { ApiConfig } from "arweave/node/lib/api";
import { SmartWeaveContractViewer } from "../handlers/SmartWeaveContractViewer.js";
import "../handlers/TransactionHandler.js";
import "arweave";
import "../../../../core/Handler.js";

type ViewerChainHandler = {
  handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};
type HandleMethodContext = Parameters<SmartWeaveContractViewer["handle"]>[0];
type ViewerChainCreateOptions = {
  /**
   * Configs to pass to {@linkcode Arweave.init}.
   */
  api_config?: ApiConfig;
};
type HandlerOutput = {
  /**
   * The result of the read operation.
   */
  read_result: any;
};
declare class ViewerChain {
  /**
   * Create a chain of handlers that result in creating an "interaction"
   * transaction on a contract.
   *
   * @param options See {@linkcode ViewerChainCreateOptions}
   * @returns The view chain's handler.
   *
   * @example
   * ```
   * const chain = ViewerChain.create({ api_config: { port: 1984 } });
   *
   * const result = await client
   *   .handle<{
   *     interaction_transaction: Transaction;
   *   }>({
   *     creator: {
   *       kty: "",
   *       n: "",
   *       e: "",
   *       d: "",
   *       p: "",
   *       q: "",
   *       dp: "",
   *       dq: "",
   *       qi: ""
   *     },
   *     contract_id: "",
   *     input: { function: "greet", payload: { message: "Hello" } }
   *   });
   * ```
   */
  static create(options: ViewerChainCreateOptions): ViewerChainHandler;
}

export { HandlerOutput, ViewerChain, ViewerChainCreateOptions };
