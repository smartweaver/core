import { describe, expect, test } from "vitest";
import { AbstractHandler } from "./AbstractHandler.ts";

class Handler extends AbstractHandler {
  readonly function_slug = "some_handler";
}

describe("properties", () => {
  describe("function_slug", () => {
    test("has the value of the slug", async () => {
      const expected = "some_handler";

      const actual = new Handler().function_slug;

      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("methods", () => {
  describe("setNextHandler()", () => {
    test("sets the next handler", async () => {
      class AnotherHandler extends AbstractHandler {
        readonly function_slug = "another_handler";

        // handle(context: any): Promise<{ hello: string }> {
        //   return {
        //     ...context,
        //     hello: "bee",
        //   };
        // }
      }

      const another = new AnotherHandler();
      const handler = new Handler();

      // handler.setNextHandler(another);

      const context = { hello: "aaa" };

      const actual = await handler.handle(context);

      expect(actual).toStrictEqual({ hello: "bee" });
    });
  });
});
