import { ApiConfig } from "arweave/node/lib/api";
import { JWKInterface } from "arweave/node/lib/wallet";
import { CreateTransactionInterface } from "arweave/node/common";
import Transaction from "arweave/node/lib/transaction";

type WriterChainHandler = {
  handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};
type HandleMethodContext = {
  /**
   * The data to use to sign the interaction transaction.
   */
  creator: JWKInterface | "use_wallet";
  /**
   * The ID of the contract to write to.
   */
  contract_id: string;
  /**
   * Attributes to help create the interaction transaction.
   */
  transaction_attributes?: CreateTransactionInterface;
  input: any;
};
type WriterChainCreateOptions = {
  /**
   * Configs to pass to {@linkcode Arweave.init}.
   */
  api_config?: ApiConfig;
};
type HandlerOutput = {
  /**
   * The transaction object representing the interaction transaction.
   */
  interaction_transaction: Transaction;
};
declare class WriterChain {
  /**
   * Create a chain of handlers that result in creating an "interaction"
   * transaction on a contract.
   *
   * @param options See {@linkcode WriterChainCreateOptions}
   * @returns The writer chain's handler.
   *
   * @example
   * ```
   * const chain = WriterChain.create({ api_config: { port: 1984 } });
   *
   * const result = await chain
   *   .handle({
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
  static create(options: WriterChainCreateOptions): WriterChainHandler;
}

export { HandlerOutput, WriterChain, WriterChainCreateOptions };
