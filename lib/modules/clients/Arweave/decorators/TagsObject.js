var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// src/modules/clients/Arweave/decorators/TagsObject.ts
function TagsObject(tags) {
  var _wrappee, _a;
  return new (_a = class {
    constructor() {
      __privateAdd(this, _wrappee, tags);
    }
    original() {
      return __privateGet(this, _wrappee);
    }
    /**
     * Convert the given `tags` to `{ name: string; value: string; }` format.
     * @param tags The tags in question.
     * @returns An array of the tags in `{ name, value }` format.
     */
    nameValueArray() {
      if (Array.isArray(__privateGet(this, _wrappee))) {
        throw new Error(`Cannot convert `);
      }
      const ret = [];
      for (const [name, value] of Object.entries(tags)) {
        ret.push({
          name,
          value
        });
      }
      return ret;
    }
  }, _wrappee = new WeakMap(), _a)();
}

export { TagsObject };
