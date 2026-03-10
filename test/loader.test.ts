import { describe, expect, it } from "vitest";
import svgSpriteLoader from "../src/loader";

// Test the loader as a plain function by mocking the loader context
function runLoader(
  svgContent: string,
  resourcePath: string,
  options: { symbolId: string } = { symbolId: "icon-[name]" },
): string {
  let result = "";
  const context = {
    resourcePath,
    getOptions: () => options,
    callback: (_err: null, output: string) => {
      result = output;
    },
  };
  svgSpriteLoader.call(context, svgContent);
  return result;
}

const sampleSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20z"/></svg>';

describe("loader", () => {
  it("should generate JS module with correct symbol id", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg");
    expect(result).toContain('"icon-arrow"');
  });

  it("should extract viewBox", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg");
    expect(result).toContain('"0 0 24 24"');
  });

  it("should include symbol html with inner content", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg");
    expect(result).toContain("<symbol");
    expect(result).toContain('id=\\"icon-arrow\\"');
    expect(result).toContain('viewBox=\\"0 0 24 24\\"');
    expect(result).toContain('<path d=\\"M12 2L2 22h20z\\"/>');
  });

  it("should use custom symbolId pattern", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg", {
      symbolId: "svg-[name]",
    });
    expect(result).toContain('"svg-arrow"');
  });

  it("should handle SVG without viewBox", () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5"/></svg>';
    const result = runLoader(svg, "/project/icons/dot.svg");
    expect(result).toContain('"icon-dot"');
    expect(result).toContain('"0 0 0 0"');
  });

  it("should import runtime add function", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg");
    expect(result).toContain("require(");
    expect(result).toContain("runtime");
  });

  it("should export default symbol object", () => {
    const result = runLoader(sampleSvg, "/project/src/icons/arrow.svg");
    expect(result).toContain("module.exports");
  });
});
