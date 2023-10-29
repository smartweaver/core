import { JWKInterface } from "arweave/node/lib/wallet";
import { interactRead } from "smartweave";
import { toNameValueArray } from "../utils/tagger.js";
import { ArweaveHandler } from "./ArweaveHandler.js";

type Context = {
  creator?: JWKInterface | "use_wallet"; // TODO(crookse) womp womp use_wallet
  contract_id: string;
  input?: any;
  tags?: Record<string, string>;
  target?: string;
  winston_qty?: string;
};

/**
 * Relay handler to SmartWeave's `interactRead()` function.
 */
export class SmartWeaveContractInteractReader extends ArweaveHandler {
  public handle(context: Context) {
    return Promise
      .resolve()
      .then(() => {
        return interactRead(
          this.arweave,
          context.creator,
          context.contract_id,
          context.input ?? {},
          toNameValueArray(context.tags ?? {}),
          context.target ?? "",
          context.winston_qty ?? "",
        );
      })
      .then((result) => {
        return {
          ...context,
          read_result: result,
        };
      })
      .then((newContext) => super.next(newContext));
  }
}
