import { SafeAreaView, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex flex-1 m-6">
    <View className="items-center flex-1 justify-center">
      <View className="w-full max-w-2xl flex-1">
        {children}
      </View>
    </View>
  </SafeAreaView>;
};

const styles = {
  container: 'flex flex-1 m-6',
};
