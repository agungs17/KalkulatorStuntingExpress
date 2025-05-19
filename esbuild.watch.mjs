import esbuild from 'esbuild';

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./index.js'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outdir: 'dist',
    format: 'esm',
    sourcemap: true,
    external: ['express', 'dotenv']
  });

  await ctx.watch();
})();