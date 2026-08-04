import { describe, expect, it } from "vitest";
import { localize, stripLocale, withLocale } from "../../src/i18n/common";

describe("site internationalization helpers", () => {
  it("keeps Chinese routes unprefixed and prefixes English routes", () => {
    expect(withLocale("zh-CN", "/works")).toBe("/works");
    expect(withLocale("en", "/works")).toBe("/en/works");
    expect(withLocale("en", "/")).toBe("/en/");
  });

  it("strips the English prefix without losing the root route", () => {
    expect(stripLocale("/en/works")).toBe("/works");
    expect(stripLocale("/en/")).toBe("/");
    expect(stripLocale("/works")).toBe("/works");
  });

  it("selects the requested localized value with a safe fallback", () => {
    expect(localize({ "zh-CN": "中文", en: "English" }, "en")).toBe("English");
    expect(localize({ "zh-CN": "中文" }, "en")).toBe("中文");
  });
});
