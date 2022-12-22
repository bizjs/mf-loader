import React from 'react';

// 模拟 external
window.React = React;

(window as any).MFLoader.init({
  'micro-app1': {
    '1.0.0': '/public/mf-assets/micro-app1/1.0.0/bootstrap.js',
  },
});
