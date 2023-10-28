import { NextableHandler } from './NextableHandler.js';
import '../../core/Handler.js';

type FirstHandler<C> = {
    handle: <R = any>(context: C) => Promise<R>;
};
declare class NextableHandlerChain {
    #private;
    protected handler(handler: NextableHandler): this;
    build(): {
        handle: <R = any, C = any>(context: C) => Promise<R>;
    };
}

export { FirstHandler, NextableHandlerChain };
