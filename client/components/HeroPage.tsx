import { HERO_INFORMATION, ValidHero } from "../../shared/types";
import { Container } from "./Container";
import { Header } from "./Header";
import { View } from "react-native";
import { HeroImage } from "./HeroImage";
import { Conversation } from "./Conversation";
import { UserInput } from "./UserInput";

export default function HeroPage({ hero }: { hero: ValidHero }) {
  return (
    <>
      <Header title={HERO_INFORMATION[hero].name} />
      <Container>
        <View className="flex-1">
          <View className="flex-1 w-full h-full overflow-y-auto flex flex-row">
            <View style={{ flexShrink: 1, flexBasis: 'auto', maxWidth: '50%' }} className="pr-4 pb-4">
              <HeroImage hero={hero} />
            </View>
            <View className="flex-1">
              <Conversation hero={hero} />
            </View>
          </View>

          <UserInput hero={hero} />
        </View>
      </Container>
    </>
  );
}