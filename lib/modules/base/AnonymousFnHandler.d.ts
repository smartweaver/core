import { Handler } from '../../core/Handler.js';

type AnonymousFn = (context: any) => any;
declare class AnonymousFnHandler implements Handler {
    protected handlerFn: AnonymousFn;
    constructor(handleFn: AnonymousFn);
    handle(context: any): Promise<any>;
}

export { AnonymousFn, AnonymousFnHandler };
