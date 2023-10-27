import { ApiConfig } from "arweave/node/lib/api";
import { Client } from "../mod";
import { TransactionSigner } from "../handlers/TransactionSigner";
import { TransactionPoster } from "../handlers/TransactionPoster";
import { JWKInterface } from "arweave/node/lib/wallet";
import Arweave, { CreateTransactionInterface } from "arweave/node/common";
import { ContractTransactionCreator } from "../handlers/ContractTransactionCreator";
import {
  createContractTransactionTags,
  createSourceCodeTransactionTags,
} from "../utils/tagger";
import { TransactionCreator } from "../handlers/TransactionCreator";
import { TransactionTagger } from "../handlers/TransactionTagger";

type DeployChainHandler = {
  handle<R>(context: HandleMethodContext): Promise<HandlerOutput & R>;
};

type HandleMethodContext = {
  /**
   * The data to use to sign the source code and contract transactions.
   */
  creator: JWKInterface | "use_wallet";
  /**
   * The data to help create the source code transaction.
   */
  source_code: Partial<CreateTransactionInterface>;

  /**
   * The data to help create the source code transaction.
   */
  initial_state: Partial<CreateTransactionInterface>;
};

export type DeployChainCreateOptions = {
  /**
   * Configs to pass to {@linkcode Arweave.init}.
   */
  api_config?: ApiConfig;
};

export type HandlerOutput = {
  /**
   * The contract's source code transaction's ID.
   */
  source_code_id: string;

  /**
   * The contract transaction's ID.
   */
  contract_id: string;
};

/**
 * Build a chain of handlers that result in creating a:
 * - contract source code transaction; and
 * - contract transaction.
 *
 * @param options See {@linkcode DeployChainCreateOptions}
 * @returns
 */
function buildDeployChain(
  options: DeployChainCreateOptions,
): DeployChainHandler {
  const apiConfig = options.api_config || {};

  const tagger = new TransactionTagger();

  return Client
    .builder()
    // Set up the context for the TransactionCreator
    .use((context) => {
      context.transaction_attributes = context.source_code;
      return context;
    })
    .use(new TransactionCreator(apiConfig))
    .use((context) =>
      tagger.handle({
        ...context,
        tags: createSourceCodeTransactionTags(),
      })
    )
    .use(new TransactionSigner(apiConfig))
    .use(new TransactionPoster(apiConfig))
    .use((context) => {
      // Store the source code transaction's ID in a spot where the contract
      // transaction creation process can use it
      context.source_code_id = context.transaction.id;
      // Remove the source code transaction so it is not used further. We only
      // need the source transaction ID.
      context.transaction = null;
      return context;
    })
    .use(new ContractTransactionCreator(apiConfig))
    .use((context) =>
      tagger.handle({
        ...context,
        tags: createContractTransactionTags(context.source_code_id),
      })
    )
    .use(new TransactionSigner(apiConfig))
    .use(new TransactionPoster(apiConfig))
    .use((context) => {
      // Perform the same kind of step done on the source code transaction
      // above, but for the contract transaction this time
      context.contract_id = context.transaction.id;
      context.transaction = null;
      return context;
    })
    // Control what data is returned to the caller here
    .use((context) => {
      return {
        source_code_id: context.source_code_id,
        contract_id: context.contract_id,
      };
    })
    .build<HandleMethodContext>();
}

export class DeployChain {
  /**
   * Create a chain of handlers that result in creating a:
   * - contract source code transaction; and
   * - contract transaction.
   *
   * The term "deploy" is used to emphasize that the transactions will be
   * deployed to the network.
   *
   * @param options See {@linkcode DeployChainCreateOptions}
   * @returns The deploy chain's handler.
   *
   * @example
   * ```
   * const chain = DeployChain.create({ api_config: { port: 1984 } });
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
   *     source_code: {
   *       data: "export function handle(state, action) { ... }",
   *     },
   *     initial_state: {
   *       data: JSON.stringify({}),
   *     },
   *   });
   * ```
   */
  static create(options: DeployChainCreateOptions) {
    return buildDeployChain(options);
  }
}
