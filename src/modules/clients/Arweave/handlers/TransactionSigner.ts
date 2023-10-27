import Transaction from "arweave/node/lib/transaction";
import { TransactionHandler } from "./TransactionHandler";
import { JWKInterface } from "arweave/node/lib/wallet";

export class TransactionSigner extends TransactionHandler {
  public handle(context: {
    transaction?: Transaction;
    creator: JWKInterface | "use_wallet";
  }) {
    if (!context.transaction) {
      return this.sendToNextHandler(context);
    }

    return this
      .arweave
      .transactions
      .sign(context.transaction, context.creator)
      .then(() => super.sendToNextHandler(context));
  }
}
