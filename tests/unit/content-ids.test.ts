import { describe, expect, it } from "vitest";
import { getWorkId, parseDocumentId } from "../../src/lib/content/ids";

describe("content ids", () => {
  it("normalizes Astro's lower-cased Chinese locale segment", () => {
    expect(parseDocumentId("cores/luna-core/zh-cn")).toEqual({
      category: "cores",
      set: "luna-core",
      locale: "zh-CN",
      path: "",
    });
  });

  it("keeps nested document paths and English locale", () => {
    expect(parseDocumentId("plugins/dominion/en/configuration/index.mdx")).toEqual({
      category: "plugins",
      set: "dominion",
      locale: "en",
      path: "configuration",
    });
  });

  it("rejects ids without a category, set, and locale", () => {
    expect(() => parseDocumentId("docs/index.mdx")).toThrow(/category, set, and locale/);
  });

  it("aggregates work data and page ids by their first segment", () => {
    expect(getWorkId("luna-core/data")).toBe("luna-core");
    expect(getWorkId("luna-core/data.yaml")).toBe("luna-core");
  });
});
