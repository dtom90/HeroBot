import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ChatConent } from '~/components/ChatConent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Container>
        <ChatConent path="app/(drawer)/(tabs)/two.tsx" title="Tab Two" />
      </Container>
    </>
  );
}
