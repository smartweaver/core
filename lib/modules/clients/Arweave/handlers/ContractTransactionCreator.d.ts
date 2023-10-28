import Transaction from "arweave/node/lib/transaction";
import { CreateTransactionInterface } from "arweave/node/common";
import { JWKInterface } from "arweave/node/lib/wallet";
import { TransactionCreator } from "./TransactionCreator.js";
import "./TransactionHandler.js";
import "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

type Context = {
  creator: JWKInterface | "use_wallet";
  transaction_attributes: CreateTransactionInterface;
  transaction: Transaction;
  initial_state: Partial<CreateTransactionInterface>;
  source_code_id: string;
};
/**
 * Basically the same implementation as the `TransactionCreator`, but with
 * validation rules around the source code transaction ID and initial state.
 */
declare class ContractTransactionCreator extends TransactionCreator {
  #private;
  handle(context: Context): Promise<Context>;
}

export { ContractTransactionCreator };
