import path from "node:path";
import type { Compiler, RuleSetRule } from "@rspack/core";

export interface SvgSymbol {
  id: string;
  viewBox: string;
  url: string;
  toString(): string;
}

export class SvgSpritePlugin {
  options: {
    symbolId: string;
    test: RegExp;
    include: RuleSetRule["include"];
    exclude: RuleSetRule["exclude"];
  };

  constructor(options = {}) {
    this.options = {
      symbolId: "icon-[name]",
      test: /\.svg$/,
      include: [],
      exclude: [],
      ...options,
    };
  }

  apply(compiler: Compiler) {
    const { symbolId, test, include, exclude } = this.options;

    compiler.options.module.rules.push({
      test,
      include,
      exclude,
      use: [
        {
          loader: path.resolve(import.meta.dirname, "loader.cjs"),
          options: { symbolId },
        },
      ],
      type: "javascript/auto",
    });
  }
}
