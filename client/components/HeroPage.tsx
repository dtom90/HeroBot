import { useEffect } from "react";
import { HERO_INFORMATION, ValidHero } from "../../shared/types";
import { useConversationStore } from "~/lib/store";
import { Container } from "./Container";
import { HeroChat } from "./HeroChat";
import { Header } from "./Header";

export default function HeroPage({ hero }: { hero: ValidHero }) {
  const setCurrentHero = useConversationStore((state) => state.setCurrentHero);
  
  useEffect(() => {
    if (hero) {
      setCurrentHero(hero as ValidHero);
    }
  }, [hero, setCurrentHero]);

  return (
    <>
      <Header title={HERO_INFORMATION[hero].name} />
      <Container>
        <HeroChat hero={hero} />
      </Container>
    </>
  );
}