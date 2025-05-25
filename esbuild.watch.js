const esbuild = require("esbuild");
const copy = require("esbuild-plugin-copy").default;

(async () => {
  const ctx = await esbuild.context({
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
          to: ['./html'], // will copy to `api/html` because outdir is `api`
        },
      ],
      watch: true,
      verbose: true
    })
  ]
  });

  await ctx.watch();
})();
