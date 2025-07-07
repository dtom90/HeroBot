import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ChatConent } from '~/components/ChatConent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <ChatConent path="app/(drawer)/(tabs)/index.tsx" title="Tab One" />
      </Container>
    </>
  );
}
