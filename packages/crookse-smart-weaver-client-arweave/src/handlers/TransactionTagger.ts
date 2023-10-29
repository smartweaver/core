import { NextableHandler } from "@crookse/smart-weaver-standard/src/base/NextableHandler";
import { tag } from "../utils/tagger";

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
