import {
  GQLNodeInterface,
  Warp,
  WriteInteractionOptions,
} from "warp-contracts";
import {
  DeployOptions as BaseDeployOptions,
  HandlerFn,
  ReadOptions as BaseReadOptions,
  WriteOptions as BaseWriteOptions,
} from "../types.ts";
import { Client as CoreClient } from "../../Client.ts";

type WithWarp<T> = T & { warp_instance: Warp };

type DeployOptions = WithWarp<BaseDeployOptions>;

type WriteOptions = WithWarp<
  BaseWriteOptions & { writeInteractionOptions?: WriteInteractionOptions }
>;

type ReadOptions = WithWarp<
  BaseReadOptions & {
    caller?: string;
    interactions?: GQLNodeInterface[];
  }
>;

export class Client extends CoreClient {
  static builder() {
    return new CoreClient.Builder();
  }

  override read<R>(options: HandlerFn<ReadOptions>): Promise<R> {
    return this.handle({ action: "read", options });
  }

  override deploy<R>(options: HandlerFn<DeployOptions>): Promise<R> {
    return this.handle({ action: "deploy", options });
  }

  override write<R>(options: HandlerFn<WriteOptions>): Promise<R> {
    return this.handle({ action: "write", options });
  }

  override evolve<R>(options: HandlerFn<{}>): Promise<R> {
    return this.handle({ action: "evolve", options });
  }
}
