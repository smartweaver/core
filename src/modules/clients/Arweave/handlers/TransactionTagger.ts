import { Handler } from "../../../../core/Handler.ts";
import { tag } from "../utils/tagger.ts";

type Context = {
  transaction: { addTag: (name: string, value: string) => void };
  tags: Record<string, string>;
};

export class TransactionTagger extends Handler {
  public handle(context: Context) {
    tag(context.transaction, context.tags);
    return super.sendToNextHandler(context);
  }
}
