import { describe, expect, test, vi } from "vitest";
import { Client } from "./mod";
import fs from "node:fs";
import {
  ContractDeploy,
  WarpFactory,
  WriteInteractionResponse,
} from "warp-contracts";
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

vi.mock("warp-contracts-plugin-deploy", () => {
  return {
    DeployPlugin: class Mocked {
      type() {
        return "deploy";
      }

      process() {
        return {
          deploy() {
            return { contractTxId: "fakeId" };
          },
        };
      }
    },
  };
});

vi.mock("warp-contracts", () => {
  return {
    WarpFactory: {
      forTestnet() {
        return {
          use(p: any) {
            return p.process();
          },
          contract() {
            return {
              connect() {
                return {
                  writeInteraction(...args: unknown[]) {
                    return args;
                  },
                  readState(...args: unknown[]) {
                    return args;
                  },
                };
              },
            };
          },
        };
      },
    },
  };
});

describe("methods", () => {
  describe("deploy()", () => {
    test("handles deploy action", async () => {
      const warp = Client.create();

      const actual = await warp.deploy<ContractDeploy>({
        warp_instance: WarpFactory.forTestnet(),
        contract: {
          type: "file",
          source_code: fs.readFileSync("contract.js", "utf-8"),
          initial_state: fs.readFileSync("initial-state.json", "utf-8"),
        },
        sender: {
          address: getWallet().address,
          key: getWallet().jwk,
        },
      });

      expect(actual.contractTxId).toBe("fakeId");
    });
  });

  describe("write()", () => {
    test("handles write action", async () => {
      const warp = Client.create();

      const interaction = {
        input: {
          function: "something",
          payload: {},
        },
      };

      const actual = await warp.write<WriteInteractionResponse>({
        warp_instance: WarpFactory.forTestnet(),
        contract_id: "jj1cZYAe_uCMQg84k88WKAtd7Ux3Kn3AvPlYBKtPkMw",
        sender: {
          address: getWallet().address,
          key: getWallet().jwk,
        },
        interaction,
        writeInteractionOptions: {},
      });

      expect(actual).toStrictEqual([interaction.input, {}]);
    });
  });

  describe("read()", () => {
    test("handles read action", async () => {
      const warp = Client.create();

      const id =
        "000001289191,1698281533200,c5abdf2d5c815bfdc40dd4262406cbcc7bb958c214ec8f1167b09a0c3e6d2a3d";

      const actual = await warp.read({
        warp_instance: WarpFactory.forTestnet(),
        contract_id: "jj1cZYAe_uCMQg84k88WKAtd7Ux3Kn3AvPlYBKtPkMw",
        sender: {
          address: getWallet().address,
          key: getWallet().jwk,
        },
        stop_at_block_id: id,
      });

      expect(actual).toStrictEqual([id, undefined, undefined]);
    });
  });
});
