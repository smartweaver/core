export type HandlerFn<I = any, O = any> = (input: I) => O | Promise<O>;

export type Sender = {
  address: string;
  key: Required<Pick<JsonWebKey, "kty" | "e" | "n">>;
};

export type DeployOptions = {
  contract: {
    type: "file" | "transaction";
    source_code: string;
    initial_state: string;
  };

  sender: Sender;
};

export type WriteOptions = {
  contract_id: string;

  sender: Sender;

  interaction: {
    input: {
      function: string;
      payload?: any;
    };
  };
};

export type ReadOptions = {
  contract_id: string;

  sender: Sender;

  stop_at_block_id: string;
};
