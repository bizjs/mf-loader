import createDebug from 'debug';
const log = createDebug('mf-loader');

export { log };

/**
 * 将远程依赖名称，转换为包名和模块名
 * @param remoteName
 * @example
 * ```
 * parseRemoteName('@bizjs/ui/Button') => {pkgName: '@bizjs/a', moduleName: 'Button'}
 * parseRemoteName('antd/Button') => {pkgName: 'antd', moduleName: 'Button'}
 *
 * @returns
 */
export function parseRemoteName(remoteName: string): {
  pkgName: string;
  moduleName: string;
} {
  const segs = remoteName.split('/');
  if (segs.length < 2) {
    throw new Error('Invalid arguments(remoteName), please check');
  }
  // 是否是作用域包
  const isScopePkg = segs[0].startsWith('@');
  // 如果是作用域包，如 @bizjs/ui/A/B，那么其中前两段是 pkgName，之后的是模块名
  // 如果非作用域包，如 lodash/get ，那么其中第一段是 pkgName，之后的是模块名
  const pkgName: string = isScopePkg ? segs.slice(0, 2).join('/') : segs[0];
  const moduleName: string = segs.slice(isScopePkg ? 2 : 1).join('/');

  return { pkgName, moduleName };
}
