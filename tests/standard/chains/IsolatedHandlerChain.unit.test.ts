import { describe, expect, test } from "vitest";
import { IsolatedHandlerChain } from "../../../src/standard/chains/IsolatedHandlerChain.ts";

describe("extensibility", () => {
  describe("chain_builder", () => {
    test("can see the chain_builder property", () => {
      class A extends IsolatedHandlerChain {
        c: string[] = [];
        use(c: string) {
          this.c.push(c);
          this.chain_builder.handler({
            function_name: "test",
            handle: () => true,
          });
          return this;
        }
      }

      const a = new A()
        .use("1234");

      expect(a.c).toStrictEqual(["1234"]);
    });
  });
});
