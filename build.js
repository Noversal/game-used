import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
  }
}).then(() => {
  console.log('⚡ Build completed successfully.');
}).catch(() => process.exit(1));
