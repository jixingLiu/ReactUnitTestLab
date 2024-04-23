import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { useNavigate } from 'umi';

export const staticFunctionsHolder: {
  navigate: ReturnType<typeof useNavigate>;
  message?: MessageInstance;
  notification?: NotificationInstance;
} = {
  navigate: () => {},
};

export function StaticFunctionSetter() {
  const { message, notification } = App.useApp();
  staticFunctionsHolder.navigate = useNavigate();
  staticFunctionsHolder.message = message;
  staticFunctionsHolder.notification = notification;
  return null;
}
