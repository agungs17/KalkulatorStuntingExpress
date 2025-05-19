const esbuild = require('esbuild');

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./index.js'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outdir: 'api',
    format: 'cjs',
    sourcemap: true,
    logLevel: 'info'
  });

  await ctx.watch();
})();