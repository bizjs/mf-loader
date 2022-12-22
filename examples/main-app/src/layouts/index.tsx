import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <Link to="/dynamic/Page1">Dynamic Page1</Link>
        </li>
        <li>
          <Link to="/dynamic/Page2">Dynamic Page2</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
