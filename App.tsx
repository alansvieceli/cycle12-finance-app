import { StatusBar } from 'expo-status-bar';

import { FinanceApp } from './src/FinanceApp';
import { Notifications } from './src/lib/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <FinanceApp />
    </>
  );
}
