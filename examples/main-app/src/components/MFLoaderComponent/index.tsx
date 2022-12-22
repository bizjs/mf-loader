import { useEffect, useRef, useState } from 'react';

export type MFLoaderComponentProps<T> = T & {
  /**
   * 必须同步配置，仅第一次有效
   */
  $loader: {
    /**
     * 远程组件名称：@seeyon/xxxx/XXXModule
     */
    componentName: string;
    version?: string;
  };
};

export function MFLoaderComponent<T = { [key: string]: any }>(
  props: MFLoaderComponentProps<T>
) {
  const { $loader, ...otherProps } = props;
  const CompRef = useRef<() => JSX.Element>();
  const [, forceUpdate] = useState({});
  console.log($loader);
  useEffect(() => {
    (window as any).MFLoader.loadRemoteModule(
      $loader.componentName,
      $loader.version
    ).then((module: any) => {
      CompRef.current = module.default;
      forceUpdate({});
    });
  }, [$loader]);
  if (!CompRef.current) {
    return <div>Loading...</div>;
  }
  return <CompRef.current {...otherProps} />;
}
