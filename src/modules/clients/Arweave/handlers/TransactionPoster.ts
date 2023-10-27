import Transaction from "arweave/node/lib/transaction";
import { TransactionHandler } from "./TransactionHandler";
import Arweave from "arweave";

type TransactionPostResult = Awaited<
  ReturnType<Arweave["transactions"]["post"]>
>;

export class TransactionPoster extends TransactionHandler {
  public handle(context: {
    transaction?: Transaction;
    transaction_post_result?: TransactionPostResult;
  }) {
    if (!context.transaction) {
      return super.sendToNextHandler(context);
    }

    return this
      .arweave
      .transactions
      .post(context.transaction)
      .then((result) => {
        context.transaction_post_result = result;
      })
      .then(() => super.sendToNextHandler(context));
  }
}
