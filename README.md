# SVG Sprite Plugin for Rspack

![Coverage total](./badges/coverage-total.svg)

An Rspack plugin that transforms SVG files into a sprite sheet of `<symbol>` elements, injected into the DOM at runtime. Each SVG module exports `{ id, viewBox, url, toString() }` for use with `<svg><use href="#icon-name"/></svg>`.

## Installation

```bash
npm install rspack-svg-sprite-loader-plugin
```

## Setup

In your `rspack.config.js`:

```js
import path from "node:path";
import { SvgSpritePlugin } from "rspack-svg-sprite-loader-plugin";

export default {
  plugins: [
    new SvgSpritePlugin({
      symbolId: "icon-[name]",
      include: [path.resolve(__dirname, "src/icons")],
    }),
  ],
};
```

### Options

| Option     | Type                     | Default         | Description                                                     |
| ---------- | ------------------------ | --------------- | --------------------------------------------------------------- |
| `symbolId` | `string`                 | `"icon-[name]"` | Pattern for symbol IDs. `[name]` is replaced with the filename. |
| `test`     | `RegExp`                 | `/\.svg$/`      | File matching pattern.                                          |
| `include`  | `RuleSetRule["include"]` | `[]`            | Paths to include.                                               |
| `exclude`  | `RuleSetRule["exclude"]` | `[]`            | Paths to exclude.                                               |

## Usage in app

```js
import arrow from "./icons/arrow.svg";

// arrow = { id: "icon-arrow", viewBox: "0 0 24 24", url: "#icon-arrow", toString() }
```

### HTML

```html
<svg viewBox="0 0 24 24">
  <use href="#icon-arrow" />
</svg>
```

### React

```jsx
import arrow from "./icons/arrow.svg";

function Icon({ svg, ...props }) {
  return (
    <svg viewBox={svg.viewBox} {...props}>
      <use href={svg.url} />
    </svg>
  );
}

<Icon svg={arrow} width={24} height={24} />;
```
