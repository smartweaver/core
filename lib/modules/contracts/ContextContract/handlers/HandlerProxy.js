// src/modules/base/AnonymousFnHandler.ts
var AnonymousFnHandler = class {
  constructor(handleFn) {
    this.handlerFn = handleFn;
  }
  handle(context) {
    return Promise.resolve().then(() => this.handlerFn(context));
  }
};

// src/modules/contracts/ContextContract/handlers/HandlerProxy.ts
var HandlerProxy = class extends AnonymousFnHandler {
  constructor(fn, handleFn) {
    super(handleFn);
    this.function_name = fn;
    this.metadata = {
      name: `__HandlerProxy__${fn}`
    };
  }
  handle(context) {
    return Promise.resolve().then(() => {
      const incomingFn = context.action.input.function;
      if (incomingFn !== this.function_name) {
        return context;
      }
      return super.handle(context);
    });
  }
};

export { HandlerProxy };
