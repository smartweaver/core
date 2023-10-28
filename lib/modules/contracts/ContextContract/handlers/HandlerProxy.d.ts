import { AnonymousFnHandler, AnonymousFn } from '../../../base/AnonymousFnHandler.js';
import { Context } from '../types/Context.js';
import '../../../../core/Handler.js';

interface HandlerWithFunctionName {
    function_name: string;
    handle(context: any): any;
}
declare class HandlerProxy extends AnonymousFnHandler {
    readonly function_name: any;
    readonly metadata: any;
    constructor(fn: string, handleFn: AnonymousFn);
    handle(context: Context): Promise<any>;
}

export { HandlerProxy, HandlerWithFunctionName };
