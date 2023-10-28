import Arweave from 'arweave';
import { ApiConfig } from 'arweave/node/lib/api';
import { NextableHandler } from '../../../base/NextableHandler.js';
import '../../../../core/Handler.js';

declare class ArweaveHandler extends NextableHandler {
    protected arweave: Arweave;
    constructor(apiConfig: ApiConfig);
}

export { ArweaveHandler };
