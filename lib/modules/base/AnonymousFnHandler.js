// src/modules/base/AnonymousFnHandler.ts
var AnonymousFnHandler = class {
  constructor(handleFn) {
    this.handlerFn = handleFn;
  }
  handle(context) {
    return Promise.resolve().then(() => this.handlerFn(context));
  }
};

export { AnonymousFnHandler };
