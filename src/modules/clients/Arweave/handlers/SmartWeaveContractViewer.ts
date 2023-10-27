import { TransactionHandler } from "./TransactionHandler";
import { readContract } from "smartweave";

type ReadResult = {
  state: any;
  validity?: Record<string, boolean>;
};

type Context = {
  contract_id: string;
  height?: number;
  return_validity?: boolean;
};
/**
 * Relay handler to SmartWeave's `readContract()` function.
 */
export class SmartWeaveContractViewer extends TransactionHandler {
  public handle(context: Context) {
    return Promise
      .resolve()
      .then(() => {
        return readContract(
          this.arweave,
          context.contract_id,
          context.height,
          context.return_validity,
        );
      })
      .then((result: ReadResult) => {
        return {
          ...context,
          read_result: result,
        };
      })
      .then((newContext) => super.sendToNextHandler(newContext));
  }
}
