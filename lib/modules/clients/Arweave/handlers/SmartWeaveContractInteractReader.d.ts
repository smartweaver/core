import { JWKInterface } from "arweave/node/lib/wallet";
import { TransactionHandler } from "./TransactionHandler.js";
import "arweave";
import "arweave/node/lib/api";
import "../../../../core/Handler.js";

type Context = {
  creator?: JWKInterface | "use_wallet";
  contract_id: string;
  input?: any;
  tags?: Record<string, string>;
  target?: string;
  winston_qty?: string;
};
/**
 * Relay handler to SmartWeave's `interactRead()` function.
 */
declare class SmartWeaveContractInteractReader extends TransactionHandler {
  handle(context: Context): Promise<{
    read_result: any;
    creator?: JWKInterface | "use_wallet" | undefined;
    contract_id: string;
    input?: any;
    tags?: Record<string, string> | undefined;
    target?: string | undefined;
    winston_qty?: string | undefined;
  }>;
}

export { SmartWeaveContractInteractReader };
