import { Stack } from 'expo-router';

import { ChatConent } from '~/components/ChatConent';
import { Container } from '~/components/Container';

export default function HeroChat() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hero Chat' }} />
      <Container>
        <ChatConent />
      </Container>
    </>
  );
}
