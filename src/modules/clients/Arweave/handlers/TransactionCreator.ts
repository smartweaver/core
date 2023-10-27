import { JWKInterface } from "arweave/node/lib/wallet";
import { TransactionHandler } from "./TransactionHandler";
import { CreateTransactionInterface } from "arweave/node/common";
import Transaction from "arweave/node/lib/transaction";

type Context = {
  creator: JWKInterface | "use_wallet"; // TODO(crookse) womp womp use_wallet
  transaction_attributes: CreateTransactionInterface;
  transaction: Transaction;
};

export class TransactionCreator extends TransactionHandler {
  public handle(context: Context) {
    return this
      .arweave
      // Create the transaction ...
      .createTransaction(context.transaction_attributes, context.creator)
      // ... then store it in the context
      .then((transaction) => {
        context.transaction = transaction;
      })
      .then(() => super.sendToNextHandler(context));
  }
}
