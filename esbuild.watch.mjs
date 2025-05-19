import esbuild from 'esbuild';
import config from './src/configurations/index.js';

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./index.js'],
    bundle: true,
    platform: 'node',
    target: config.esBuild,
    outdir: 'dist',
    format: 'esm',
    sourcemap: true,
    external: ['express', 'dotenv']
  });

  await ctx.watch();
})();