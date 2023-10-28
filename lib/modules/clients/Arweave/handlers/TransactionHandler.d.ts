import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { Handler } from "../../../../core/Handler.js";

declare class TransactionHandler extends Handler {
  protected arweave: Arweave;
  constructor(apiConfig: ApiConfig);
}

export { TransactionHandler };
