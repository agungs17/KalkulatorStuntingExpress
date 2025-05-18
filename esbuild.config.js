const { build } = require('esbuild');

build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outdir: 'dist',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
  external: ['express', 'dotenv']
}).catch(() => process.exit(1));