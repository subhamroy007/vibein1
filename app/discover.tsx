import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyle } from "../styles";
import { Tabs } from "expo-router";
import { useDiscoverFeed } from "../hooks/client.hooks";
import GridPostList from "../components/grid-post/GripPostList";

export default function Discover() {
  const { discoverFeedParams } = useDiscoverFeed();

  if (!discoverFeedParams) {
    return null;
  }

  return (
    <SafeAreaView style={[layoutStyle.flex_1]}>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <GridPostList postGroups={discoverFeedParams.postGrounps} />
    </SafeAreaView>
  );
}
