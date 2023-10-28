import { describe, expect, test } from "vitest";
import { Contract } from "@/src/modules/contracts/ContextContract/mod.ts";
import { Context as BaseContext } from "@/src/modules/contracts/ContextContract/types/Context.ts";

interface Context<S, P = any> extends BaseContext<S, P> {
  action: {
    input: {
      function: string;
      payload?: P;
    };
  };
}

describe("methods", () => {
  describe("builder()", () => {
    test("can build a contract", async () => {
      const state = { greetings: [0, 1] };

      class Add extends Contract.Handler {
        handle(context: Context<typeof state, number>) {
          context.state.greetings.push(context.action.input.payload!);
          return context;
        }
      }

      const contract = Contract
        .builder()
        .initialState(state)
        .action(new Add("add"))
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

    test("can use a mix a handler signatures (fn and class types)", async () => {
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

      class NoHandleMethod extends Contract.Handler {
        public handle(context: any) {
          return context;
        }
      }

      const contract = Contract
        .builder()
        .initialState(state)
        .action(new Add("add"))
        .action("pop", (context) => {
          context.state.greetings.pop();
          return context;
        })
        .action(new NoHandleMethod("no_handle_method"))
        .build<Context<typeof state>>();

      // expect(contract.functions.length).toBe(4);

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

      // result = await contract.handle({
      //   state: result.state,
      //   action: {
      //     input: {
      //       function: "add",
      //       payload: 2337,
      //     },
      //   },
      // });
      // expect(result.state).toStrictEqual({ greetings: [0, 1, 11, 2337] });

      // result = await contract.handle({
      //   state: result.state,
      //   action: {
      //     input: {
      //       function: "pop",
      //     },
      //   },
      // });
      // expect(result.state).toStrictEqual({ greetings: [0, 1, 11] });

      // result = await contract.handle({
      //   state: result.state,
      //   action: {
      //     input: {
      //       function: "add",
      //       payload: 1111,
      //     },
      //   },
      // });
      // expect(result.state).toStrictEqual({ greetings: [0, 1, 11, 1111] });

      // result = await contract.handle({
      //   state: result.state,
      //   action: {
      //     input: {
      //       function: "pop",
      //     },
      //   },
      // });
      // expect(result.state).toStrictEqual({ greetings: [0, 1, 11] });

      // result = await contract.handle({
      //   state: result.state,
      //   action: {
      //     input: {
      //       function: "pop",
      //     },
      //   },
      // });
      // expect(result.state).toStrictEqual({ greetings: [0, 1] });
    });
  });
});
