import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useHomeFeed } from "../../../hooks/client.hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyle } from "../../../styles";
import FullScreenPostList from "../../../components/FullScreenPostList";

export default function FullScreenFeed() {
  const { post } = useLocalSearchParams<{ post: string }>();

  const { fetch, homeFeedParams } = useHomeFeed();

  const router = useRouter();

  const backHandler = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  if (!post || !homeFeedParams) {
    return null;
  }

  return (
    <SafeAreaView style={layoutStyle.flex_1}>
      <Stack.Screen
        options={{
          header: () => null,
        }}
      />
      <FullScreenPostList
        data={homeFeedParams.posts}
        onRetry={fetch}
        state={homeFeedParams.thunkInfo.state}
      />
    </SafeAreaView>
  );
}
