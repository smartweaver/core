import { JWKInterface } from 'arweave/node/lib/wallet';
import { ArweaveHandler } from './ArweaveHandler.js';
import { CreateTransactionInterface } from 'arweave/node/common';
import Transaction from 'arweave/node/lib/transaction';
import 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type Context = {
    creator: JWKInterface | "use_wallet";
    transaction_attributes: CreateTransactionInterface;
    transaction: Transaction;
};
declare class TransactionCreator extends ArweaveHandler {
    handle(context: Context): Promise<any>;
}

export { TransactionCreator };
