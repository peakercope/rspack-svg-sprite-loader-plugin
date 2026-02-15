# SVG Sprite Plugin for Rspack

Adds a module rule that processes SVG files through the "svg-sprite-loader".
Uses the standard Rspack plugin API (apply method).

## Usage:

```js
import { SvgSpritePlugin } from "rspack-svg-sprite-loader-plugin";

plugins: [
  new SvgSpritePlugin({
    symbolId: "icon-[name]",
    include: [path.resolve(__dirname, "src/icons")],
  }),
];
```
