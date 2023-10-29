import { ApiConfig } from "arweave/node/lib/api";
import Arweave from "arweave/node/common";
import { SmartWeaveContractViewer } from "../handlers/SmartWeaveContractViewer.js";
import { ChainWithUseMethod } from "./ChainWithUseMethod.js";

type ViewerChainHandler = {
  handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};

type HandleMethodContext = Parameters<
  SmartWeaveContractViewer["handle"]
>[0];

export type ViewerChainCreateOptions = {
  /**
   * Configs to pass to {@linkcode Arweave.init}.
   */
  api_config?: ApiConfig;
};

export type HandlerOutput = {
  /**
   * The result of the read operation.
   */
  read_result: any;
};

/**
 * Build a chain to view a contract.
 *
 * @param options See {@linkcode ViewerChainCreateOptions}
 * @returns
 */
function buildViewerChain(
  options: ViewerChainCreateOptions,
): ViewerChainHandler {
  const apiConfig = options.api_config || {};

  const builder = new ChainWithUseMethod();

  return builder
    .use(new SmartWeaveContractViewer(apiConfig))
    // Control what data is returned to the caller here
    .use((context) => {
      return {
        read_result: context.read_result,
      };
    })
    .build();
}

export class ViewerChain {
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
  static create(options: ViewerChainCreateOptions) {
    return buildViewerChain(options);
  }
}
