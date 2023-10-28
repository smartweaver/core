// src/modules/contracts/ContextContract/decorators/Interaction.ts
function Interaction(action) {
  var _a, _b;
  return new class Interaction {
    constructor() {
      this.input = action == null ? void 0 : action.input;
      this.function = (_a = action == null ? void 0 : action.input) == null
        ? void 0
        : _a.function;
      this.payload = (_b = action == null ? void 0 : action.input) == null
        ? void 0
        : _b.payload;
    }
  }();
}

export { Interaction };
