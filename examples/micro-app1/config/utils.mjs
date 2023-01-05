import fse from 'fs-extra';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export function root(...args) {
  return path.join(__dirname, '..', ...args);
}

export function isDirectory() {
  return fse.statSync(projectDir).isDirectory();
}

export function pathJoin(...args) {
  return path.join(...args);
}

/**
 *
 * @param {import('webpack').Configuration} opt webpack 构建参数
 * @returns
 */
export function runWebpack(name, opt) {
  return new Promise((resolve) => {
    webpack(opt, (err, stat) => {
      console.log(
        `${name} 构建完毕，err=`,
        err,
        stat.toJson({
          all: false,
          errors: true,
          errorDetails: true,
          errorsCount: true,
        }),
        `耗时${(stat.endTime - stat.startTime) / 1000}s`
      );
      resolve(err);
    });
  });
}

export function fileExists(filepath) {
  return fse.existsSync(filepath);
}

export function readJSONSync(pathname) {
  return fse.readJSONSync(pathname);
}
