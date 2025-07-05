const { build } = require("esbuild");

build({
  entryPoints: ["index.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  outdir: "api",
  format: "cjs",
  sourcemap: false,
  logLevel: "info",
  minify: true,
  minifyWhitespace : true,
  minifyIdentifiers : true,
  minifySyntax : true,
  treeShaking: true,
  packages: "external",
  drop: ["console", "debugger"]
}).catch(() => process.exit(1));
