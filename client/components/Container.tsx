import { SafeAreaView, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
    <View className="items-center flex-1 justify-center">
      <View className="w-full max-w-4xl flex-1">
        {children}
      </View>
    </View>
  </SafeAreaView>;
};
