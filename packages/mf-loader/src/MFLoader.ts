import { maxSatisfying } from 'es-semver';
import { log, parseRemoteName } from './utils';

export interface MFContainer {
  init(scope: any): Promise<void>;
  get(name: string, scope?: any): Promise<any>;
}

declare global {
  interface Window {
    __MFSharedContainer__: {
      $PKG_CONFIG: any;
      [key: string]: any;
    };
  }
}

declare const __webpack_init_sharing__: (name: string) => Promise<void>;
declare const __webpack_share_scopes__: { mfShared: any };

const loadedEntryMap: Record<string, boolean> = {};
const pkgCache: Record<
  string,
  { versions: string[]; versionMap: Record<string, string> }
> = {};

function getEntryUrlAndUniqueName(
  pkgName: string,
  version: string
): { entryUrl: string; uniqueName: string } {
  const pkgInfo = pkgCache[pkgName];
  const maxSafeVersion = maxSatisfying(pkgInfo.versions, version || '');
  if (!maxSafeVersion) {
    throw new Error(`Can't find incompatible version, package[${pkgName}]`);
  }
  const entryUrl = pkgInfo?.versionMap?.[maxSafeVersion];
  if (!entryUrl) {
    throw new Error(
      `entryUrl is empty, ${pkgName}@${maxSafeVersion} not found`
    );
  }
  return { entryUrl, uniqueName: `${pkgName}$${maxSafeVersion}` };
}

/**
 * 拉取远端包
 * @param remoteEntry
 * @returns
 */
async function loadRemoteEntry(remoteEntry: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loadedEntryMap[remoteEntry]) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = remoteEntry;

    script.onerror = reject;

    script.onload = () => {
      loadedEntryMap[remoteEntry] = true;
      resolve(); // window is the global namespace
    };

    document.body.append(script);
  });
}

async function lookupExposedModule<T>(
  uniqueName: string,
  moduleName: string
): Promise<T> {
  await __webpack_init_sharing__('mfShared');
  const container = window.__MFSharedContainer__[uniqueName];

  await container.init(__webpack_share_scopes__.mfShared);
  const factory = await container.get(moduleName);
  const Module = factory();
  return Module as T;
}

/**
 * 初始化版本缓存
 * @param pkgConfig
 * @example
 * ```
 * const pkgConfig = {
 *  'antd': {
 *    '4.0.0': 'https://xxxx.com/xxx.js',
 *    '5.0.0': 'https://xxxx.com/xxx.js'
 *  }
 * };
 * ```
 */
export function init(pkgConfig: Record<string, Record<string, string>>) {
  Object.keys(pkgConfig).forEach((key) => {
    const val = pkgConfig[key];
    pkgCache[key] = {
      versions: Object.keys(val),
      versionMap: val,
    };
  });
  log('init: pkgConfig = %o, pkgCache = %o', pkgConfig, pkgCache);
}

/**
 * 动态加载远程模块
 * @param remoteName
 * @param version
 * @returns
 */
export async function loadRemoteModule(remoteName: string, version?: string) {
  const { pkgName, moduleName } = parseRemoteName(remoteName);
  const { entryUrl, uniqueName } = getEntryUrlAndUniqueName(
    pkgName,
    version || ''
  );
  log(
    'loadComponent: args = %o, parsedArgs = %o',
    { remoteName, version },
    { pkgName, moduleName, uniqueName, entryUrl }
  );
  await loadRemoteEntry(entryUrl);
  return await lookupExposedModule<any>(uniqueName, `./${moduleName}`);
}

/**
 * 加载远程依赖包
 * @param pkgName
 * @param version
 * @returns
 */
export async function loadRemoteDep(
  pkgName: string,
  version?: string
): Promise<MFContainer> {
  const { entryUrl, uniqueName } = getEntryUrlAndUniqueName(
    pkgName,
    version || ''
  );
  log(
    'loadRemoteDep: args = %o, parsedArgs = %o',
    { pkgName, version },
    { uniqueName, entryUrl }
  );
  await loadRemoteEntry(entryUrl);
  const container: MFContainer = window.__MFSharedContainer__[uniqueName];
  return {
    get(request) {
      return container.get(request);
    },
    init() {
      return container.init(__webpack_share_scopes__.mfShared);
    },
  };
}
