import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { HeroList } from '~/components/HeroList';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <HeroList />
      </Container>
    </>
  );
}
