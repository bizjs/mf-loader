import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist/esm' },
  cjs: { output: 'dist/cjs' },
  umd: { name: 'MFLoader', output: 'dist/umd', externals: { react: 'React' } },
});
