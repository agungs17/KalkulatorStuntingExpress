import { build } from 'esbuild';

async function run() {
  const ctx = await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outdir: 'dist',
    format: 'esm',
    sourcemap: true,
    logLevel: 'info',
  });

  await ctx.watch();
}

run().catch(() => process.exit(1));