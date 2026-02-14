const svgSpriteLoader = require("svg-sprite-loader");

module.exports = function (content) {
  const compilation = this._compilation;

  if (compilation && compilation.moduleGraph) {
    const { getIssuer } = compilation.moduleGraph;

    if (getIssuer) {
      compilation.moduleGraph.getIssuer = function (...args) {
        try {
          return getIssuer.apply(this, args);
        } catch {
          return null;
        }
      };
    }
  }

  return svgSpriteLoader.call(this, content);
};
