import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { NextableHandler } from "@/src/modules/base/NextableHandler.ts";

export class ArweaveHandler extends NextableHandler {
  protected arweave: Arweave;

  constructor(apiConfig: ApiConfig) {
    super();
    this.arweave = new Arweave(apiConfig);
  }
}
