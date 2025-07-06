import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'nprogress.js',
  output: [
    {
      file: 'dist/nprogress.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/nprogress.cjs',
      format: 'cjs',
      exports: 'default',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ]
};