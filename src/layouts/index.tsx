import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Outlet } from 'umi';

export default function Layout() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </ConfigProvider>
  );
}
