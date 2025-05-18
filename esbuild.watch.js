// esbuild.watch.js
const { context } = require('esbuild');

(async () => {
  const ctx = await context({
    entryPoints: ['./index.js'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outdir: 'dist',
    format: 'cjs',
    sourcemap: true,
    logLevel: 'info',
    external: ['express', 'dotenv']
  });

  await ctx.watch();
})();