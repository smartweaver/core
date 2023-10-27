/**
 * These tests require `arlocal` to be running and the wallet address must have
 * tokens. Start `arlocal` (e.g., `npx arlocal`) and hit the following endpoint:
 *
 * http://localhost:1984/mint/SlmnacKpHHNwLNvvkPVKBvm3IxqKWhHcHTPsdSMTg_k/10000000000
 */

import { beforeAll, describe, expect, test, vi } from "vitest";

import { JWKInterface } from "arweave/node/lib/wallet";
import Transaction from "arweave/node/lib/transaction";
import { CreateTransactionInterface } from "arweave/node/common";

import { ContractTransactionCreator } from "./handlers/ContractTransactionCreator.ts";
import { TransactionPoster } from "./handlers/TransactionPoster.ts";
import { TransactionSigner } from "./handlers/TransactionSigner.ts";
import { Client } from "./mod.ts";
import {
  createContractTransactionTags,
  createSourceCodeTransactionTags,
  readTags,
} from "./utils/tagger.ts";
import { TransactionCreator } from "./handlers/TransactionCreator.ts";
import { TransactionTagger } from "./handlers/TransactionTagger.ts";
import { getWallet } from "../../../../tests/utils.ts";

vi.mock("node:fs", () => {
  return {
    default: {
      readFileSync(file: string) {
        if (file === "contract.js") {
          return `export function handle(state, action) { return { state }; }`;
        }

        if (file === "initial-state.json") {
          return JSON.stringify({ hello: "world" });
        }
      },
    },
  };
});

type Context = {
  creator: JWKInterface | "use_wallet";
  source_code: Partial<CreateTransactionInterface>;
  initial_state: Partial<CreateTransactionInterface>;
};

describe("methods", () => {
  beforeAll(async () => {
    await fetch(
      `http://localhost:1984/mint/${getWallet().address}/1000000000000`,
    );
  });

  describe("builder()", () => {
    test("can build a deployer", async () => {
      const apiConfig = { port: 1984 };

      const tagger = new TransactionTagger();

      // Intentionally do not follow the same pattern used in `DeployChain` so
      // we can fully test the flexibility of this builder
      const client = Client
        .builder()
        .use((context) => {
          context.transaction_attributes = context.source_code;
          return context;
        })
        .use(new TransactionCreator(apiConfig))
        .use((context) =>
          tagger.handle({
            ...context,
            tags: createSourceCodeTransactionTags(),
          })
        )
        .use(new TransactionSigner(apiConfig))
        .use(new TransactionPoster(apiConfig))
        .use((context) => {
          context.source_code_transaction = context.transaction;
          context.source_code_id = context.transaction.id;
          context.transaction = null;
          return context;
        })
        .use(new ContractTransactionCreator(apiConfig))
        .use((context) =>
          tagger.handle({
            ...context,
            tags: createContractTransactionTags(context.source_code_id),
          })
        )
        .use(new TransactionSigner(apiConfig))
        .use(new TransactionPoster(apiConfig))
        .use((context) => {
          context.contract_transaction = context.transaction;
          context.transaction = null;
          return context;
        })
        .build<Context>();

      const result = await client
        .handle<{
          source_code_transaction: Transaction;
          contract_transaction: Transaction;
        }>({
          creator: getWallet().jwk,
          source_code: {
            data: "export function handle(state, action) { return { state }; }",
          },
          initial_state: {
            data: JSON.stringify({ hello: "world" }),
          },
        });

      expect(result.contract_transaction.id).toBeTypeOf("string");
      expect(result.source_code_transaction.id).toBeTypeOf("string");

      const actualSourceCodeTransactionTags = readTags(
        result.source_code_transaction.tags,
      );
      expect(actualSourceCodeTransactionTags)
        .toStrictEqual(createSourceCodeTransactionTags());

      const actualContractTransactionTags = readTags(
        result.contract_transaction.tags,
      );
      expect(actualContractTransactionTags)
        .toStrictEqual(
          createContractTransactionTags(result.source_code_transaction.id),
        );
    });
  });

  describe("deployer()", () => {
    test("can deploy", async () => {
      const client = Client.deployer({ api_config: { port: 1984 } });

      const result = await client
        .handle({
          creator: getWallet().jwk,
          source_code: {
            data: "export function handle(state, action) { return { state }; }",
          },
          initial_state: {
            data: JSON.stringify({ hello: "world" }),
          },
        });

      expect(result.contract_id).toBeTypeOf("string");
      expect(result.source_code_id).toBeTypeOf("string");
    });
  });

  describe("reader()", () => {
    test("can read", async () => {
      const config = { api_config: { port: 1984 } };
      const creator = getWallet().jwk;

      // We need to deploy a contract and write to it before doing an
      const deployer = Client.deployer(config);

      const contract = await deployer.handle({
        creator,
        initial_state: {
          data: JSON.stringify({
            greetings: [],
          }),
        },
        source_code: {
          data: `
          export function handle(state, action) {
            // console.log({ "__LOG_ID__": "src_code", state, action })
            state.greetings.push(action.input);

            if (action.input.function === "get") {
              // console.log("YES", state.greetings)
              return { result: state.greetings }
            }

            return { state };
          }`,
        },
      });

      const contractId = contract.contract_id;
      expect(contractId).toBeTypeOf("string");

      const reader = Client.reader({ api_config: { port: 1984 } });

      const result = await reader
        .handle({
          creator: getWallet().jwk,
          contract_id: contractId,
          input: {
            function: "get", // TODO(crookse) This seems like a strange way to say GET
          },
        });

      expect(result.read_result).toStrictEqual([{ function: "get" }]);
    });
  });

  describe("viewer()", () => {
    test("can view", async () => {
      const config = { api_config: { port: 1984 } };
      const creator = getWallet().jwk;

      // We need to deploy a contract and write to it before doing an
      const deployer = Client.deployer(config);

      const contract = await deployer.handle({
        creator,
        initial_state: {
          data: JSON.stringify({
            greetings: [],
          }),
        },
        source_code: {
          data: `
          export function handle(state, action) {
            // console.log({ "__LOG_ID__": "src_code", state, action })
            state.greetings.push(action.input);

            if (action.input.function === "get") {
              // console.log("YES", state.greetings)
              return { result: state.greetings }
            }

            return { state };
          }`,
        },
      });

      const contractId = contract.contract_id;
      expect(contractId).toBeTypeOf("string");

      const viewer = Client.viewer({ api_config: { port: 1984 } });

      const result1 = await viewer
        .handle({
          contract_id: contractId,
        });

      expect(result1.read_result).toStrictEqual({ greetings: [] });

      // Now write and check the state again

      const writer = Client.writer({ api_config: { port: 1984 } });

      await writer
        .handle({
          contract_id: contractId,
          creator,
          input: {
            function: "greet",
          },
        });

      // After writing, we need to mine the block so the next `viewer` call
      // below sees the new state
      await fetch("http://localhost:1984/mine");

      const result2 = await viewer
        .handle({
          contract_id: contractId,
        });

      expect(result2.read_result).toStrictEqual({
        greetings: [{ function: "greet" }],
      });
    });
  });
});
