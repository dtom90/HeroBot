import { Stack } from 'expo-router';

import { ChatConent } from '~/components/ChatConent';
import { Container } from '~/components/Container';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hero Bot' }} />
      <Container>
        <ChatConent />
      </Container>
    </>
  );
}
