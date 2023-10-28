import { ArweaveHandler } from './ArweaveHandler.js';
import 'arweave';
import 'arweave/node/lib/api';
import '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

type Context = {
    contract_id: string;
    height?: number;
    return_validity?: boolean;
};
/**
 * Relay handler to SmartWeave's `readContract()` function.
 */
declare class SmartWeaveContractViewer extends ArweaveHandler {
    handle(context: Context): Promise<any>;
}

export { SmartWeaveContractViewer };
