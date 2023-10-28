var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value,
    })
    : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) {
    if (__hasOwnProp.call(b, prop)) {
      __defNormalProp(a, prop, b[prop]);
    }
  }
  if (__getOwnPropSymbols) {
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) {
        __defNormalProp(a, prop, b[prop]);
      }
    }
  }
  return a;
};

// src/modules/clients/Arweave/utils/tagger.ts
function tag(taggable, tags) {
  for (const [key, value] of Object.entries(tags)) {
    taggable.addTag(key, value);
  }
}
function toNameValueArray(tags) {
  const ret = [];
  for (const [name, value] of Object.entries(tags)) {
    ret.push({
      name,
      value,
    });
  }
  return ret;
}
function createSourceCodeTransactionTags(extraTags = {}) {
  return __spreadValues({
    "App-Name": "SmartWeaveContractSource",
    "App-Version": "0.3.0",
    // TODO(crookse) Configurable
    "Content-Type": "application/javascript",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract_source",
    }),
  }, extraTags);
}
function createContractTransactionTags(
  sourceCodeTransactionId,
  extraTags = {},
) {
  return __spreadValues({
    "App-Name": "SmartWeaveContract",
    "App-Version": "0.3.0",
    // TODO(crookse) Configurable
    "Contract-Src": sourceCodeTransactionId,
    "Content-Type": "application/json",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract",
    }),
  }, extraTags);
}
function createWriteInteractionTransactionTags(contractId, input) {
  return {
    "App-Name": "SmartWeaveAction",
    "App-Version": "0.3.0",
    "Contract": contractId,
    "Input": JSON.stringify(input),
  };
}
function readTags(tags) {
  const ret = {};
  tags.slice().map((tag2) => {
    const key = tag2.get("name", { decode: true, string: true });
    const value = tag2.get("value", { decode: true, string: true });
    ret[key] = value;
  });
  return ret;
}

export {
  createContractTransactionTags,
  createSourceCodeTransactionTags,
  createWriteInteractionTransactionTags,
  readTags,
  tag,
  toNameValueArray,
};
