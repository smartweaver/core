import Transaction from 'arweave/node/lib/transaction';
import { CreateTransactionInterface } from 'arweave/node/common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { TransactionCreator } from './TransactionCreator.js';
import './ArweaveHandler.js';
import 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type Context = {
    creator: JWKInterface | "use_wallet";
    transaction_attributes: CreateTransactionInterface;
    transaction: Transaction;
    initial_state: Partial<CreateTransactionInterface>;
    source_code_id: string;
};
/**
 * Basically the same implementation as the `TransactionCreator`, but with
 * validation rules around the source code transaction ID and initial state.
 */
declare class ContractTransactionCreator extends TransactionCreator {
    #private;
    handle(context: Context): Promise<any>;
}

export { ContractTransactionCreator };
