import Transaction from "arweave/node/lib/transaction";
import { TransactionHandler } from "./TransactionHandler.js";
import Arweave from "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

type TransactionPostResult = Awaited<
  ReturnType<Arweave["transactions"]["post"]>
>;
declare class TransactionPoster extends TransactionHandler {
  handle(context: {
    transaction?: Transaction;
    transaction_post_result?: TransactionPostResult;
  }): Promise<{
    transaction?: Transaction | undefined;
    transaction_post_result?: {
      status: number;
      statusText: string;
      data: any;
    } | undefined;
  }>;
}

export { TransactionPoster };
