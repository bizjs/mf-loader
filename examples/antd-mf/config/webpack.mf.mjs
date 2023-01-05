import { root, runWebpack, readJSONSync, readDirFiles } from './utils.mjs';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';

const pkgJSON = readJSONSync(root('package.json'));

const pkgName = 'antd';

// 所有要打包的组件名
const componentNames = readDirFiles(root('src/components')).map((x) =>
  x.replace('.ts', '')
);

/**
 * @returns {import('webpack').Configuration}
 */
export const buildConfig = () => ({
  entry: root('src/index.ts'),
  mode: 'production',
  devtool: false, // 'cheap-source-map',
  output: {
    clean: true,
    path: root('../main-app/public/mf-assets'), // 将内容直接生成到 main-app/public 下
    filename: '[name]_[contenthash:8].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
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
  optimization: {
    splitChunks: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: pkgName,
      library: {
        type: 'var',
        name: ['__MFSharedContainer__', `${pkgName}$${pkgJSON.version}`],
      },
      filename: `${pkgName}/${pkgJSON.version}/bootstrap.js`,
      exposes: componentNames.reduce((result, cName) => {
        result[`./${cName}`] = {
          name: `${pkgName}/${pkgJSON.version}/${cName}`,
          import: [root(`./src/components/${cName}.ts`)],
        };
        return result;
      }, {}),

      // 如果有 MF 依赖，就这样去生成
      // remotes: {
      //   xxx: `promise window.MFLoader.loadRemoteDep('xxxx', '1.0.0')`,
      // },
    }),
  ],
});

await runWebpack(pkgJSON.name, buildConfig());
console.log('构建完毕');
