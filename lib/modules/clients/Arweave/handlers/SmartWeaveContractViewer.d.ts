import { TransactionHandler } from "./TransactionHandler.js";
import "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

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
declare class SmartWeaveContractViewer extends TransactionHandler {
  handle(context: Context): Promise<{
    read_result: ReadResult;
    contract_id: string;
    height?: number | undefined;
    return_validity?: boolean | undefined;
  }>;
}

export { SmartWeaveContractViewer };
