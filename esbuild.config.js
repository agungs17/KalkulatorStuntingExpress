const { build } = require("esbuild");
const copy = require("esbuild-plugin-copy").default;

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
  plugins: [
    copy({
      assets: [
        {
          from: ['./src/html/*.html'],
          to: ['./html']
        },
      ],
      watch: false,
      verbose: true
    })
  ]
}).catch(() => process.exit(1));
