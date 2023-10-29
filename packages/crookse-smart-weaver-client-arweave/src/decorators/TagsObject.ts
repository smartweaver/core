type NameValue = { name: string; value: string };

export function TagsObject(tags: Record<string, string>) {
  return new class TagsObject {
    #wrappee = tags;

    original() {
      return this.#wrappee;
    }

    /**
     * Convert the given `tags` to `{ name: string; value: string; }` format.
     * @param tags The tags in question.
     * @returns An array of the tags in `{ name, value }` format.
     */
    nameValueArray(): NameValue[] {
      if (Array.isArray(this.#wrappee)) {
        throw new Error(`Cannot convert `);
      }

      const ret: NameValue[] = [];

      for (const [name, value] of Object.entries(tags)) {
        ret.push({
          name,
          value,
        });
      }

      return ret;
    }
  }();
}
