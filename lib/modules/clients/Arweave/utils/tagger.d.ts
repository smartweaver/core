import { Tag } from "arweave/node/lib/transaction";

type Taggable = {
  addTag: (key: string, value: string) => void;
};
type NameValue = {
  name: string;
  value: string;
};
declare function tag(taggable: Taggable, tags: Record<string, string>): void;
declare function toNameValueArray(tags: Record<string, string>): NameValue[];
declare function createSourceCodeTransactionTags(
  extraTags?: Record<string, string>,
): {
  "App-Name": string;
  "App-Version": string;
  "Content-Type": string;
  "Test-Tag": string;
};
declare function createContractTransactionTags(
  sourceCodeTransactionId: string,
  extraTags?: Record<string, string>,
): {
  "App-Name": string;
  "App-Version": string;
  "Contract-Src": string;
  "Content-Type": string;
  "Test-Tag": string;
};
declare function createWriteInteractionTransactionTags(
  contractId: string,
  input: Record<string, unknown>,
): {
  "App-Name": string;
  "App-Version": string;
  Contract: string;
  Input: string;
};
declare function readTags(tags: Tag[]): Record<string, string>;

export {
  createContractTransactionTags,
  createSourceCodeTransactionTags,
  createWriteInteractionTransactionTags,
  readTags,
  tag,
  toNameValueArray,
};
