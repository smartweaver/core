import { JWKInterface } from "arweave/node/lib/wallet";
import { TransactionHandler } from "./TransactionHandler.js";
import { CreateTransactionInterface } from "arweave/node/common";
import Transaction from "arweave/node/lib/transaction";
import "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

type Context = {
  creator: JWKInterface | "use_wallet";
  transaction_attributes: CreateTransactionInterface;
  transaction: Transaction;
};
declare class TransactionCreator extends TransactionHandler {
  handle(context: Context): Promise<Context>;
}

export { TransactionCreator };
