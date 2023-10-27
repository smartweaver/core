import Transaction from "arweave/node/lib/transaction";
import { CreateTransactionInterface } from "arweave/node/common";
import { JWKInterface } from "arweave/node/lib/wallet";
import { TransactionCreator } from "./TransactionCreator";

type Context = {
  creator: JWKInterface | "use_wallet"; // TODO(crookse) womp womp use_wallet
  transaction_attributes: CreateTransactionInterface;
  transaction: Transaction;
  initial_state: Partial<CreateTransactionInterface>;
  source_code_id: string;
};

/**
 * Basically the same implementation as the `TransactionCreator`, but with
 * validation rules around the source code transaction ID and initial state.
 */
export class ContractTransactionCreator extends TransactionCreator {
  public handle(context: Context) {
    this.#validate(context);

    context.transaction_attributes.data = context.initial_state.data!;

    return super
      .handle(context)
      .then(() => super.sendToNextHandler(context));
  }

  #validate(context: unknown) {
    if (
      !context ||
      (typeof context !== "object")
    ) {
      throw new Error(`Handler argument \`context\` should be an object`);
    }

    if (
      !("source_code_id" in context) ||
      !context.source_code_id
    ) {
      throw new Error(`Field \`source_code_id\` is required`);
    }

    if (typeof context.source_code_id !== "string") {
      throw new Error(`Field \`source_code_id\` should be a string`);
    }

    if (
      !("initial_state" in context) ||
      !context.initial_state ||
      (typeof context.initial_state !== "object")
    ) {
      throw new Error(`Field \`initial_state\` is required`);
    }
  }
}
