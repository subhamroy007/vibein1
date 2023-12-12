import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyle } from "../../styles";
import { Stack, Tabs, useRouter } from "expo-router";
import { useDiscoverFeed } from "../../hooks/client.hooks";
import GridPostList from "../../components/grid-post/GripPostList";
import { useCallback } from "react";

export default function Discover() {
  const { discoverFeedParams } = useDiscoverFeed();

  const router = useRouter();

  const gridPressCallback = useCallback(
    (id: string) => {
      // router.push({ pathname: `/discover/classic_post_feed/${id}` });
    },
    [router]
  );

  const previewPressCallback = useCallback(
    (id: string) => {
      // router.push({ pathname: `/discover/classic_post_feed/${id}` });
    },
    [router]
  );

  if (!discoverFeedParams) {
    return null;
  }

  return (
    <SafeAreaView style={[layoutStyle.flex_1]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <GridPostList
        postGroups={discoverFeedParams.postGrounps}
        onPress={gridPressCallback}
        onPreviewPress={previewPressCallback}
      />
    </SafeAreaView>
  );
}
