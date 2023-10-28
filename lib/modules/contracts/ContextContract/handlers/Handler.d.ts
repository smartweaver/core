import { Handler as Handler$1 } from '../../../../core/Handler.js';

declare abstract class Handler implements Handler$1 {
    readonly function_name: string;
    constructor(functionName: string);
    abstract handle(context: any): any;
}

export { Handler };
