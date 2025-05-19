const { build } = require("esbuild");

build({
  entryPoints: ["index.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  outdir: "api",
  format: "cjs",
  sourcemap: 'external',
  logLevel: "info",
  minify: true,
  treeShaking: true,
  packages: "external",
}).catch(() => process.exit(1));
