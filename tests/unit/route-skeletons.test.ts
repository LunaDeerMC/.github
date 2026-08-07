import { describe, expect, it } from "vitest";
import { resolveSkeletonType } from "../../src/lib/route-skeletons";

describe("resolveSkeletonType", () => {
  it("maps every known page layout to its own skeleton type", () => {
    expect(resolveSkeletonType("/")).toBe("home");
    expect(resolveSkeletonType("/en/")).toBe("home");
    expect(resolveSkeletonType("/about")).toBe("about");
    expect(resolveSkeletonType("/en/about")).toBe("about");
    expect(resolveSkeletonType("/support")).toBe("support");
    expect(resolveSkeletonType("/en/support")).toBe("support");
    expect(resolveSkeletonType("/works")).toBe("works");
    expect(resolveSkeletonType("/en/works")).toBe("works");
    expect(resolveSkeletonType("/works/dominion")).toBe("work-detail");
    expect(resolveSkeletonType("/en/works/easier-building")).toBe("work-detail");
    expect(resolveSkeletonType("/docs")).toBe("docs-index");
    expect(resolveSkeletonType("/docs/cores")).toBe("docs-index");
    expect(resolveSkeletonType("/en/docs/plugins")).toBe("docs-index");
    expect(resolveSkeletonType("/docs/cores/deerfolia")).toBe("docs-article");
    expect(resolveSkeletonType("/en/docs/general/legal/privacy")).toBe("docs-article");
    expect(resolveSkeletonType("/search")).toBe("search");
    expect(resolveSkeletonType("/en/search")).toBe("search");
  });

  it("falls back to the generic content skeleton for unknown pages", () => {
    expect(resolveSkeletonType("/404")).toBe("content");
    expect(resolveSkeletonType("/en/404")).toBe("content");
    expect(resolveSkeletonType("/unknown-page")).toBe("content");
  });
});
