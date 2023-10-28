import { Context } from '../types/Context.js';

declare function Interaction<P = any>(action: Context<unknown, P>["action"]): {
    readonly input: {
        function: string;
        payload?: P | undefined;
    };
    readonly function: string;
    readonly payload: P | undefined;
};

export { Interaction };
