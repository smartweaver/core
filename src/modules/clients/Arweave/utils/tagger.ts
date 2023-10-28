import { Tag } from "arweave/node/lib/transaction";

// TODO(crookse) Generic
type Taggable = {
  addTag: (key: string, value: string) => void;
};

type NameValue = { name: string; value: string };

export function tag(taggable: Taggable, tags: Record<string, string>) {

  for (const [key, value] of Object.entries(tags)) {
    taggable.addTag(key, value);
  }
}

export function toNameValueArray(
  tags: Record<string, string>,
): NameValue[] {
  const ret: NameValue[] = [];

  for (const [name, value] of Object.entries(tags)) {
    ret.push({
      name,
      value,
    });
  }

  return ret;
}

export function createSourceCodeTransactionTags(
  extraTags: Record<string, string> = {},
) {
  return {
    "App-Name": "SmartWeaveContractSource",
    "App-Version": "0.3.0", // TODO(crookse) Configurable
    "Content-Type": "application/javascript",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract_source",
    }),
    ...extraTags,
  };
}

export function createContractTransactionTags(
  sourceCodeTransactionId: string,
  extraTags: Record<string, string> = {},
) {
  return {
    "App-Name": "SmartWeaveContract",
    "App-Version": "0.3.0", // TODO(crookse) Configurable
    "Contract-Src": sourceCodeTransactionId,
    "Content-Type": "application/json",
    "Test-Tag": JSON.stringify({
      version: "v0.0.0",
      transaction_type: "contract",
    }),
    ...extraTags,
  };
}

export function createWriteInteractionTransactionTags(
  contractId: string,
  input: Record<string, unknown>,
) {
  return {
    "App-Name": "SmartWeaveAction",
    "App-Version": "0.3.0",
    "Contract": contractId,
    "Input": JSON.stringify(input),
  };
}

export function readTags(tags: Tag[]) {
  const ret: Record<string, string> = {};

  tags.slice().map((tag) => {
    const key = tag.get("name", { decode: true, string: true });
    const value = tag.get("value", { decode: true, string: true });
    ret[key] = value;
  });

  return ret;
}
