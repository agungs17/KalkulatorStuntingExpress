const { build } = require("esbuild");

build({
  entryPoints: ["index.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  outdir: "api",
  format: "cjs",
  sourcemap: true,
  logLevel: "info",
  minify: false,
  treeShaking: true,
  packages: "external",
}).catch(() => process.exit(1));
