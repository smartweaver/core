import Transaction from 'arweave/node/lib/transaction';
import { ArweaveHandler } from './ArweaveHandler.js';
import Arweave from 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type TransactionPostResult = Awaited<ReturnType<Arweave["transactions"]["post"]>>;
declare class TransactionPoster extends ArweaveHandler {
    handle(context: {
        transaction?: Transaction;
        transaction_post_result?: TransactionPostResult;
    }): Promise<any>;
}

export { TransactionPoster };
