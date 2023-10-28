import { NextableHandler } from '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type Context = {
    transaction: {
        addTag: (name: string, value: string) => void;
    };
    tags: Record<string, string>;
};
declare class TransactionTagger extends NextableHandler {
    handle(context: Context): Promise<any>;
}

export { TransactionTagger };
