import { describe, expect, test } from "vitest";
import { Contract } from "./mod.ts";
import { Context as BaseContext } from "./types/Context.ts";

interface Context<S, P = any> extends BaseContext<S, P> {
  action: {
    input: {
      function: string;
      payload: P
    }
  }
}

describe("methods", () => {
  describe("builder()", () => {
    test("can build a contract", async () => {
      const state = { greetings: [0, 1] };

      class Add extends Contract.Handler {
        function_name = "add";

        handle(context: Context<typeof state, number>) {
          context.state.greetings.push(context.action.input.payload);
          return context;
        }
      }

      const contract = Contract
        .builder()
        .initialState(state)
        .interaction(new Add())
        .build();

      function createContext(payload: number) {
        return {
          state,
          action: {
            input: {
              function: "add",
              payload,
            },
          },
        };
      }

      let result;

      result = await contract.handle(createContext(2));
      expect(result.state).toStrictEqual({ greetings: [0, 1, 2] });

      result = await contract.handle(createContext(1));
      expect(result.state).toStrictEqual({ greetings: [0, 1, 2, 1] });

      result = await contract.handle(createContext(8));
      expect(result.state).toStrictEqual({ greetings: [0, 1, 2, 1, 8] });
    });

    test.only("can use a mix a handler signatures (fn and class types)", async () => {
      const state = { greetings: [0, 1] };

      class Add extends Contract.Handler {
        function_name = "add";

        handle(context: Context<typeof state>) {
          if (context.action.input.payload) {
            context.state.greetings.push(context.action.input.payload);
          }

          return context;
        }
      }

      const contract = Contract
        .builder()
        .initialState(state)
        .interaction(new Add())
        .interaction("pop", (context) => {
          context.state.greetings.pop();
          return context;
        })
        .build();

      let result;

      result = await contract.handle({
        state,
        action: {
          input: {
            function: "add",
            payload: 11,
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1, 11] });

      result = await contract.handle({
        state: result.state,
        action: {
          input: {
            function: "add",
            payload: 2337,
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1, 11, 2337] });

      result = await contract.handle({
        state: result.state,
        action: {
          input: {
            function: "pop",
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1, 11] });

      result = await contract.handle({
        state: result.state,
        action: {
          input: {
            function: "add",
            payload: 1111,
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1, 11, 1111] });

      result = await contract.handle({
        state: result.state,
        action: {
          input: {
            function: "pop",
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1, 11] });

      result = await contract.handle({
        state: result.state,
        action: {
          input: {
            function: "pop",
          },
        },
      });
      expect(result.state).toStrictEqual({ greetings: [0, 1] });
    });
  });
});
