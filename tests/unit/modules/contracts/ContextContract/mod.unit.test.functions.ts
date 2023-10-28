import { Contract } from "@/src/modules/contracts/ContextContract/mod.ts";
import { describe, test, vitest } from "vitest";

const now = Date.now();
vitest.useFakeTimers().setSystemTime(now);

describe("handle()", () => {
  // describe("add", () => {
  //   test("handles known function: add", async () => {
  //     const result = await handle(
  //       { storage: [] },
  //       {
  //         input: {
  //           function: "add",
  //           payload: {
  //             item: "add",
  //           },
  //         },
  //       },
  //     );

  //     expect(result).toStrictEqual({ state: { storage: ["add"] } });
  //   });
  // });

  describe("subtract", () => {
    test("handles known function: subtract", async () => {
      const result = await handle(
        { storage: [] },
        {
          input: {
            function: "subtract",
            payload: {
              item: "sub",
            },
          },
        },
      );

      console.log({ result: result.state });

      // expect(result).toStrictEqual({ state: { storage: ["sub"] } });
    });
  });

  // describe("wwaaaat", () => {
  //   test("handles unknown function: wwaaaat", async () => {
  //     return handle(
  //       { storage: [] },
  //       {
  //         input: {
  //           function: "wwaaaat",
  //           payload: {
  //             item: "sub",
  //           },
  //         },
  //       },
  //     )
  //       .then(() => {
  //         assert(false); // This should not be hit
  //       })
  //       .catch((e: Error) => {
  //         expect(e.message).toBe("Unknown function 'wwaaaat' provided");
  //       });
  //   });
  // });
});

type State = {
  storage: string[];
};

const initialState: State = {
  storage: [],
};

class Multiply extends Contract.Handler {
  public handle(context: any) {
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    console.log(`[MULTIPLY] Op. we got it`);
    return context;
  }
}

const contract = Contract
  .builder()
  .initialState(initialState)
  .action("add", (context) => {
    console.log("action.add");
    const { input } = context.action;

    context.state.storage.push(input.payload.item);

    console.log(`\n\nwe in here`, context.state);

    return context;
  })
  .action("subtract", (context) => {
    console.log("\n[Action.subtract] We in here");

    const { input } = context.action;

    context.state.storage.push(input.payload.item);

    console.log(`\n\nthis should not be hit`);

    return context;
  })
  .action(new Multiply("multiply"))
  .build();

function handle(currentState: any, action: any) {
  console.log(`Calling handle(state, action)`);
  
  return contract
    .handle({
      state: currentState,
      action,
    })
    .then((context) => {
      return { state: context.state };
    });
}
