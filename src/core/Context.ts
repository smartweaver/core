export type Context<S = unknown> = {
  state: S;
  interaction: {
    input: {
      function: string;
    };
  };
  caller?: string;
};
