import path from "node:path";

function extractViewBox(svgContent: string): string {
  const match = svgContent.match(/viewBox=["']([^"']+)["']/);
  return match ? match[1] : "0 0 0 0";
}

function extractInnerContent(svgContent: string): string {
  const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return match ? match[1].trim() : "";
}

function escapeForString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

interface LoaderContext {
  resourcePath: string;
  getOptions: () => { symbolId: string };
  callback: (err: null, result: string) => void;
}

export default function svgSpriteLoader(
  this: LoaderContext,
  source: string,
): void {
  const options = this.getOptions();
  const name = path.basename(
    this.resourcePath,
    path.extname(this.resourcePath),
  );
  const symbolId = options.symbolId.replace("[name]", name);
  const viewBox = extractViewBox(source);
  const innerContent = extractInnerContent(source);
  const symbolHtml = `<symbol id="${symbolId}" viewBox="${viewBox}">${innerContent}</symbol>`;

  const runtimePath = path
    .resolve(import.meta.dirname, "runtime.cjs")
    .replace(/\\/g, "/");

  const output = `
var runtime = require("${runtimePath}");
var id = "${escapeForString(symbolId)}";
var viewBox = "${escapeForString(viewBox)}";
var symbolHtml = "${escapeForString(symbolHtml)}";
runtime.add(id, symbolHtml);
module.exports = { id: id, viewBox: viewBox, url: "#" + id, toString: function() { return "#" + id; } };
`.trim();

  this.callback(null, output);
}
