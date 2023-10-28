import { NextableHandler } from "@/src/modules/base/NextableHandler.ts";
import { tag } from "../utils/tagger.ts";

type Context = {
  transaction: { addTag: (name: string, value: string) => void };
  tags: Record<string, string>;
};

export class TransactionTagger extends NextableHandler {
  public handle(context: Context) {
    return Promise
      .resolve()
      .then(() => tag(context.transaction, context.tags))
      .then(() => super.next(context));
  }
}
