// esbuild.watch.js
const { context } = require('esbuild');
const { default: config } = require('./src/configurations');

(async () => {
  const ctx = await context({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    target: [config.runtime],
    outdir: 'dist',
    format: 'cjs',
    sourcemap: true,
    logLevel: 'info',
    external: ['express', 'dotenv']
  });

  await ctx.watch();
})();