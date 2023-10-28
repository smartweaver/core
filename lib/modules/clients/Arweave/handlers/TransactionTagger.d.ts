import { Handler } from "../../../../core/Handler.js";

type Context = {
  transaction: {
    addTag: (name: string, value: string) => void;
  };
  tags: Record<string, string>;
};
declare class TransactionTagger extends Handler {
  handle(context: Context): Promise<Context>;
}

export { TransactionTagger };
