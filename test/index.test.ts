import path from "node:path";
import { describe, expect, it } from "vitest";
import { SvgSpritePlugin } from "../src/index";

function createMockCompiler() {
  return {
    options: {
      module: {
        rules: [] as unknown[],
      },
    },
  };
}

describe("SvgSpritePlugin", () => {
  it("should set default options", () => {
    const plugin = new SvgSpritePlugin();

    expect(plugin.options.symbolId).toBe("icon-[name]");
    expect(plugin.options.test).toEqual(/\.svg$/);
    expect(plugin.options.include).toEqual([]);
    expect(plugin.options.exclude).toEqual([]);
  });

  it("should merge custom options with defaults", () => {
    const plugin = new SvgSpritePlugin({
      symbolId: "svg-[name]",
      include: [/src\/icons/],
    });

    expect(plugin.options.symbolId).toBe("svg-[name]");
    expect(plugin.options.include).toEqual([/src\/icons/]);
    expect(plugin.options.test).toEqual(/\.svg$/);
    expect(plugin.options.exclude).toEqual([]);
  });

  it("should push a rule to compiler module rules on apply", () => {
    const plugin = new SvgSpritePlugin();
    const compiler = createMockCompiler();

    plugin.apply(compiler as never);

    expect(compiler.options.module.rules).toHaveLength(1);

    const rule = compiler.options.module.rules[0] as Record<string, unknown>;
    expect(rule.test).toEqual(/\.svg$/);
    expect(rule.type).toBe("javascript/auto");
    expect(rule.include).toEqual([]);
    expect(rule.exclude).toEqual([]);
  });

  it("should configure loader with symbolId option", () => {
    const plugin = new SvgSpritePlugin({ symbolId: "my-[name]" });
    const compiler = createMockCompiler();

    plugin.apply(compiler as never);

    const rule = compiler.options.module.rules[0] as Record<string, unknown>;
    const use = rule.use as Array<{ loader: string; options: Record<string, string> }>;

    expect(use).toHaveLength(1);
    expect(use[0].loader).toBe(path.resolve(__dirname, "../src", "loader.cjs"));
    expect(use[0].options).toEqual({ symbolId: "my-[name]" });
  });

  it("should use custom test pattern", () => {
    const plugin = new SvgSpritePlugin({ test: /\.icon\.svg$/ });
    const compiler = createMockCompiler();

    plugin.apply(compiler as never);

    const rule = compiler.options.module.rules[0] as Record<string, unknown>;
    expect(rule.test).toEqual(/\.icon\.svg$/);
  });

  it("should apply include and exclude rules", () => {
    const plugin = new SvgSpritePlugin({
      include: [/src\/icons/],
      exclude: [/node_modules/],
    });
    const compiler = createMockCompiler();

    plugin.apply(compiler as never);

    const rule = compiler.options.module.rules[0] as Record<string, unknown>;
    expect(rule.include).toEqual([/src\/icons/]);
    expect(rule.exclude).toEqual([/node_modules/]);
  });
});
