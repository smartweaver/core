/**
 * These tests require `arlocal` to be running and the wallet address must have
 * tokens. Start `arlocal` (e.g., `npx arlocal`) and hit the following endpoint:
 *
 * http://localhost:1984/mint/SlmnacKpHHNwLNvvkPVKBvm3IxqKWhHcHTPsdSMTg_k/10000000000
 */

import { describe, expect, test } from "vitest";
import { getWallet } from "@/tests/utils.ts";
import { WriterChain } from "@/src/modules/clients/Arweave/chains/WriterChain";
import { DeployChain } from "@/src/modules/clients/Arweave/chains/DeployChain";

describe("methods", () => {
  describe("handle()", () => {
    test("can write a transaction to a contract", async () => {
      const config = { api_config: { port: 1984 } };
      const creator = getWallet().jwk;

      // First we need to deploy a contract
      const deployer = DeployChain.create(config);

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
            console.log("WTF")
            state.greetings.push(action);
            return { state };
          }`,
        },
      });

      const contractId = contract.contract_id;

      expect(contractId).toBeTypeOf("string");

      const writer = WriterChain.create(config);

      const input = { function: "greet", payload: { message: "hello!" } };

      const result = await writer.handle({
        creator,
        contract_id: contractId,
        input,
      });

      expect(result.interaction_transaction.id).toBeTypeOf("string");
    });
  });
});
