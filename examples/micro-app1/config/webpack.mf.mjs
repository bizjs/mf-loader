import { root, runWebpack, readJSONSync } from './utils.mjs';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';

const pkgJSON = readJSONSync(root('package.json'));

/**
 * @returns {import('webpack').Configuration}
 */
export const buildConfig = () => ({
  entry: root('src/index.ts'),
  mode: 'development',
  devtool: false, // 'cheap-source-map',
  output: {
    // clean: true,
    path: root('../main-app/public/mf-assets'), // 将内容直接生成到 main-app/public 下
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    react: 'React',
  },
  optimization: {
    splitChunks: false,

  },
  module: {
    rules: [
      // TypeScript
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          // options: { configFile: root('config/tsconfig.mf.json') },
        },
        exclude: [/node_modules/],
      },
      // {
      //   test: /\.less$/,
      //   use: [
      //     // 注意，loader 是倒叙执行，less -> css -> style
      //     { loader: 'style-loader' },
      //     { loader: 'css-loader', options: { modules: true } },
      //     { loader: 'less-loader' },
      //   ],
      //   exclude: [/node_modules/],
      // },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: pkgJSON.name,
      library: {
        type: 'var',
        name: ['__MFSharedContainer__', `${pkgJSON.name}$${pkgJSON.version}`],
      },
      filename: `${pkgJSON.name}/${pkgJSON.version}/bootstrap.js`,
      exposes: {
        './Page1': {
          name: `${pkgJSON.name}/${pkgJSON.version}/Page1`,
          import: [root('./src/Page1/index.tsx')],
        },
        './Page2': {
          name: `${pkgJSON.name}/${pkgJSON.version}/Page2`,
          import: [root('./src/Page2/index.tsx')],
        },
      },
      // 如果有 MF 依赖，就这样去生成
      remotes: {
        // 'antd':
        //   'antd@http://localhost:8002/public/mf-assets/antd/5.1.2/bootstrap.js',
        antd: `promise window.MFLoader.loadRemoteDep('antd', '5.1.2')`,
      },
    }),
  ],
});

await runWebpack(pkgJSON.name, buildConfig());
console.log('构建完毕');
