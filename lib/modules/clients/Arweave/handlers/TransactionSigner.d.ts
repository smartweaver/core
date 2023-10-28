import Transaction from 'arweave/node/lib/transaction';
import { ArweaveHandler } from './ArweaveHandler.js';
import { JWKInterface } from 'arweave/node/lib/wallet';
import 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

declare class TransactionSigner extends ArweaveHandler {
    handle(context: {
        transaction?: Transaction;
        creator: JWKInterface | "use_wallet";
    }): Promise<any>;
}

export { TransactionSigner };
