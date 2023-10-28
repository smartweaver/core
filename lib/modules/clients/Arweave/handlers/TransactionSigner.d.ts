import Transaction from "arweave/node/lib/transaction";
import { TransactionHandler } from "./TransactionHandler.js";
import { JWKInterface } from "arweave/node/lib/wallet";
import "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

declare class TransactionSigner extends TransactionHandler {
  handle(context: {
    transaction?: Transaction;
    creator: JWKInterface | "use_wallet";
  }): Promise<{
    transaction?: Transaction | undefined;
    creator: JWKInterface | "use_wallet";
  }>;
}

export { TransactionSigner };
