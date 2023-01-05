import { root, runWebpack, readJSONSync } from './utils.mjs';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';

const pkgJSON = readJSONSync(root('package.json'));

const pkgName = 'antd';

/**
 * @type {import('webpack').Configuration}
 */
export const buildConfig = () => ({
  entry: root('index.ts'),
  mode: 'development',
  devtool: false, // 'cheap-source-map',
  output: {
    // clean: true,
    path: root('../main-app/public/mf-assets'), // 将内容直接生成到 main-app/public 下
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
  },
  externals: {
    react: 'React',
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
      name: pkgName,
      library: {
        type: 'var',
        name: ['__MFSharedContainer__', `${pkgName}$${pkgJSON.version}`],
      },
      filename: `${pkgName}/${pkgJSON.version}/bootstrap.js`,
      exposes: {
        './Form': {
          name: `${pkgName}/${pkgJSON.version}/Form`,
          import: [root('./src/components/Form.ts')],
        },
        './Table': {
          name: `${pkgName}/${pkgJSON.version}/Table`,
          import: [root('./src/components/Table.ts')],
        },
        './Input': {
          name: `${pkgName}/${pkgJSON.version}/Input`,
          import: [root('./src/components/Input.ts')],
        },
      },
      // 如果有 MF 依赖，就这样去生成
      // remotes: {
      //   xxx: `promise window.MFLoader.loadRemoteDep('xxxx', '1.0.0')`,
      // },
    }),
  ],
});

await runWebpack(pkgJSON.name, buildConfig());
console.log('构建完毕');
