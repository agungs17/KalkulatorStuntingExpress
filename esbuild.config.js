const { build } = require('esbuild');
const { default: config } = require('./src/configurations');

build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: [config.runtime],
  outdir: 'dist',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
  external: ['express', 'dotenv']
}).catch(() => process.exit(1));