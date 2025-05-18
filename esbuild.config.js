const { build } = require('esbuild');

build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outdir: '.',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
  external: ['express', 'dotenv']
}).catch(() => process.exit(1));