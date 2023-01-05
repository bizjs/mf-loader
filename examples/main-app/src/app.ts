import React from 'react';
import ReactDOM from 'react-dom';

// 模拟 external
window.React = React;
window.ReactDOM = ReactDOM;

(window as any).MFLoader.init({
  'micro-app1': {
    '1.0.0': '/public/mf-assets/micro-app1/1.0.0/bootstrap.js',
  },
  antd: {
    '5.1.2': '/public/mf-assets/antd/5.1.2/bootstrap.js',
  },
});
