// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("runtime", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    // Re-import to reset module state
    vi.resetModules();
  });

  it("should create sprite container on first add", async () => {
    const { add } = await import("../src/runtime");
    add(
      "test-icon",
      '<symbol id="test-icon" viewBox="0 0 24 24"><path d="M0 0"/></symbol>',
    );

    const container = document.querySelector("svg[data-svg-sprite]");
    expect(container).not.toBeNull();
    expect(container?.getAttribute("aria-hidden")).toBe("true");
    expect(container?.innerHTML).toContain('id="test-icon"');
  });

  it("should not add duplicate symbols", async () => {
    const { add } = await import("../src/runtime");
    const symbol = '<symbol id="dup" viewBox="0 0 24 24"><path/></symbol>';
    add("dup", symbol);
    add("dup", symbol);

    const container = document.querySelector("svg[data-svg-sprite]");
    const matches = container?.innerHTML.match(/id="dup"/g);
    expect(matches).toHaveLength(1);
  });

  it("should reuse existing sprite container", async () => {
    const { add } = await import("../src/runtime");
    add("a", '<symbol id="a" viewBox="0 0 24 24"><path/></symbol>');
    add("b", '<symbol id="b" viewBox="0 0 24 24"><path/></symbol>');

    const containers = document.querySelectorAll("svg[data-svg-sprite]");
    expect(containers).toHaveLength(1);
    expect(containers[0].innerHTML).toContain('id="a"');
    expect(containers[0].innerHTML).toContain('id="b"');
  });

  it("should safely handle server-side (no document)", async () => {
    // simulate environment without a DOM
    const realDoc = global.document;
    vi.stubGlobal("document", undefined);

    const { add } = await import("../src/runtime");

    expect(() => add("foo", "<symbol/>")).not.toThrow();

    vi.stubGlobal("document", realDoc);
  });
});
