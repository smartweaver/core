import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { Handler } from "../../../../core/Handler.ts";

export class TransactionHandler extends Handler {
  protected arweave: Arweave;

  constructor(apiConfig: ApiConfig) {
    super();
    this.arweave = new Arweave(apiConfig);
  }
}
