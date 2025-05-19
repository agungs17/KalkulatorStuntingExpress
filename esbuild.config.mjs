import { build } from 'esbuild';
import config from './src/configurations/index.js';

build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: [config.esBuild],
  outdir: 'dist',
  format: 'esm',
  sourcemap: true,
  logLevel: 'info',
  external: ['express', 'dotenv']
}).catch(() => process.exit(1));