import Transaction from "arweave/node/lib/transaction";
import { ArweaveHandler } from "./ArweaveHandler";
import { JWKInterface } from "arweave/node/lib/wallet";

export class TransactionSigner extends ArweaveHandler {
  public handle(context: {
    transaction?: Transaction;
    creator: JWKInterface | "use_wallet";
  }) {
    if (!context.transaction) {
      return this.next(context);
    }

    return this
      .arweave
      .transactions
      .sign(context.transaction, context.creator)
      .then(() => super.next(context));
  }
}
