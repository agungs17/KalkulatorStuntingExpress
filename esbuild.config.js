const { build } = require('esbuild') 

async function run() {
  const ctx = await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    platform: 'node',
    target: ['node20'],
    outdir: 'dist',
    format: 'cjs',
    sourcemap: true,
    logLevel: 'info',
    external: ['express', 'dotenv']
  });

  await ctx.watch();
}

run().catch(() => process.exit(1));