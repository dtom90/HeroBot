import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ChatConent } from '~/components/ChatConent';

export default function Modal() {
  return (
    <>
      <ChatConent path="app/modal.tsx" title="Modal"></ChatConent>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
