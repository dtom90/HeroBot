import { useEffect } from "react";
import { HERO_INFORMATION, ValidHero } from "../../shared/types";
import { useConversationStore } from "~/lib/store";
import { Container } from "./Container";
import { Header } from "./Header";
import { View } from "react-native";
import { HeroImage } from "./HeroImage";
import { Conversation } from "./Conversation";
import { UserInput } from "./UserInput";

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
        <View className="flex-1">
          <View className="flex-1 w-full h-full overflow-y-auto flex flex-row">
            <View style={{ flexShrink: 1, flexBasis: 'auto', maxWidth: '50%' }}>
              <HeroImage hero={hero} />
            </View>
            <View className="flex-1">
              <Conversation />
            </View>
          </View>

          <UserInput />
        </View>
      </Container>
    </>
  );
}