// esbuild.config.js
const { build } = require('esbuild');

build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  target: ['node18'], // Railway umumnya pakai node 18
  outdir: 'dist',
  format: 'cjs', // CommonJS agar tidak error dynamic require
  sourcemap: true,
  logLevel: 'info',
  external: ['express', 'dotenv']
}).catch(() => process.exit(1));