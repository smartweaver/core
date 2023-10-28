import { JWKInterface } from 'arweave/node/lib/wallet';
import { ArweaveHandler } from './ArweaveHandler.js';
import 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type Context = {
    creator?: JWKInterface | "use_wallet";
    contract_id: string;
    input?: any;
    tags?: Record<string, string>;
    target?: string;
    winston_qty?: string;
};
/**
 * Relay handler to SmartWeave's `interactRead()` function.
 */
declare class SmartWeaveContractInteractReader extends ArweaveHandler {
    handle(context: Context): Promise<any>;
}

export { SmartWeaveContractInteractReader };
