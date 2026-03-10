import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    loader: "src/loader.ts",
    runtime: "src/runtime.ts",
  },
  dts: true,
  tsconfig: "tsconfig.build.json",
  format: ["esm", "cjs"],
  clean: true,
});
