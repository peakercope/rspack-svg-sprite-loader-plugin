import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  dts: true,
  tsconfig: "tsconfig.build.json",
  format: ['esm', 'cjs'],
  clean: true,
  copy: {
    from: 'src/loader.cjs',
  }
});
