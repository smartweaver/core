type NameValue = {
    name: string;
    value: string;
};
declare function TagsObject(tags: Record<string, string>): {
    "__#1479@#wrappee": Record<string, string>;
    original(): Record<string, string>;
    /**
     * Convert the given `tags` to `{ name: string; value: string; }` format.
     * @param tags The tags in question.
     * @returns An array of the tags in `{ name, value }` format.
     */
    nameValueArray(): NameValue[];
};

export { TagsObject };
