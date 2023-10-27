/**
 * These tests require `arlocal` to be running and the wallet address must have
 * tokens. Start `arlocal` (e.g., `npx arlocal`) and hit the following endpoint:
 *
 * http://localhost:1984/mint/SlmnacKpHHNwLNvvkPVKBvm3IxqKWhHcHTPsdSMTg_k/10000000000
 */

import { describe, expect, test } from "vitest";
import { DeployChain } from "./DeployChain";
import { getWallet } from "../../../../../tests/utils.ts";

describe("methods", () => {
  test("can build a deployer", async () => {
    const chain = DeployChain.create({ api_config: { port: 1984 } });

    const result = await chain
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
