import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { NextableHandler } from "@crookse/smart-weaver-standard/src/base/NextableHandler";

export class ArweaveHandler extends NextableHandler {
  protected arweave: Arweave;

  constructor(apiConfig: ApiConfig) {
    super();
    this.arweave = new Arweave(apiConfig);
  }
}
