import { ApiConfig } from "arweave/node/lib/api";
import { Client } from "../mod";
import Arweave from "arweave/node/common";
import { SmartWeaveContractInteractReader } from "../handlers/SmartWeaveContractInteractReader.ts";

type ReaderChainHandler = {
  handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};

type HandleMethodContext = Parameters<
  SmartWeaveContractInteractReader["handle"]
>[0];

export type ReaderChainCreateOptions = {
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
 * Build a chain to write interactions to a contract.
 *
 * @param options See {@linkcode ReaderChainCreateOptions}
 * @returns
 */
function buildReaderChain(
  options: ReaderChainCreateOptions,
): ReaderChainHandler {
  const apiConfig = options.api_config || {};

  return Client
    .builder()
    .use(new SmartWeaveContractInteractReader(apiConfig))
    // Control what data is returned to the caller here
    .use((context) => {
      return {
        read_result: context.read_result,
      };
    })
    .build();
}

export class ReaderChain {
  /**
   * Create a chain of handlers that result in creating an "interaction"
   * transaction on a contract.
   *
   * @param options See {@linkcode ReaderChainCreateOptions}
   * @returns The writer chain's handler.
   *
   * @example
   * ```
   * const chain = ReaderChain.create({ api_config: { port: 1984 } });
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
  static create(options: ReaderChainCreateOptions) {
    return buildReaderChain(options);
  }
}
