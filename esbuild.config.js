const { build } = require('esbuild')

build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'api',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info'
}).catch(() => process.exit(1));