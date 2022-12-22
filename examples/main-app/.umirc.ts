import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  headScripts: ['/public/mf-loader.min.js'],
  routes: [
    { path: '/', component: 'index' },
    {
      path: '/docs',
      component: 'docs',
    },
    {
      path: '/dynamic/:pageId',
      component: 'DynamicPage',
    },
  ],
});
