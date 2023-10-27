export type HandlerFn<I = any, O = any> = (input: I) => O | Promise<O>;

export type Context<S, P = any> = {
  state: S;
  interaction: {
    input: {
      function: string;
      payload: P;
    };
  };
};

export type KeyValues<O = {}> = { [K in keyof O]: O[K] };
