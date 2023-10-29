import { ApiConfig } from "arweave/node/lib/api";
import { TransactionSigner } from "../handlers/TransactionSigner";
import { TransactionPoster } from "../handlers/TransactionPoster";
import { JWKInterface } from "arweave/node/lib/wallet";
import Arweave, { CreateTransactionInterface } from "arweave/node/common";
import { createWriteInteractionTransactionTags, tag } from "../utils/tagger";
import Transaction from "arweave/node/lib/transaction";
import { TransactionCreator } from "../handlers/TransactionCreator";
import { ChainWithUseMethod } from "./ChainWithUseMethod.js";

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

export type WriterChainCreateOptions = {
  /**
   * Configs to pass to {@linkcode Arweave.init}.
   */
  api_config?: ApiConfig;
};

export type HandlerOutput = {
  /**
   * The transaction object representing the interaction transaction.
   */
  interaction_transaction: Transaction;
};

/**
 * Build a chain to write interactions to a contract.
 *
 * @param options See {@linkcode WriterChainCreateOptions}
 * @returns
 */
function buildWriterChain(
  options: WriterChainCreateOptions,
) {
  const apiConfig = options.api_config || {};

  const builder = new ChainWithUseMethod();

  return builder
    .use((context) => {
      context.transaction_attributes = {
        ...context.transaction_attributes,
        data: Math.random().toString().slice(-4), // Inspo from arweave-js
      };

      return context;
    })
    .use(new TransactionCreator(apiConfig))
    .use((context) => {
      tag(
        context.transaction,
        createWriteInteractionTransactionTags(
          context.contract_id,
          context.input,
        ),
      );
      return context;
    })
    .use(new TransactionSigner(apiConfig))
    .use(new TransactionPoster(apiConfig))
    // Control what data is returned to the caller here
    .use((context) => {
      return {
        interaction_transaction: context.transaction,
      };
    })
    .build();
}

export class WriterChain {
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
  static create(options: WriterChainCreateOptions) {
    return buildWriterChain(options);
  }
}
