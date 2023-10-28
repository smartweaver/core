import Transaction from "arweave/node/lib/transaction";
import { ArweaveHandler } from "./ArweaveHandler";
import Arweave from "arweave";

type TransactionPostResult = Awaited<
  ReturnType<Arweave["transactions"]["post"]>
>;

export class TransactionPoster extends ArweaveHandler {
  public handle(context: {
    transaction?: Transaction;
    transaction_post_result?: TransactionPostResult;
  }) {
    if (!context.transaction) {
      return super.next(context);
    }

    return this
      .arweave
      .transactions
      .post(context.transaction)
      .then((result) => {
        context.transaction_post_result = result;
      })
      .then(() => super.next(context));
  }
}
