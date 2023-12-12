import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { layoutStyle } from "../../../styles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useSimilarPostsSection } from "../../../hooks/post.hooks";
import { useCallback } from "react";
import FullScreenPostList from "../../../components/FullScreenPostList";

export default function FullScreenFeed() {
  const { post } = useLocalSearchParams<{ post: string }>();

  const { fetch, storeParams } = useSimilarPostsSection(post);

  const router = useRouter();

  const { top } = useSafeAreaInsets();

  const backHandler = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  if (!post || !storeParams) {
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
        data={storeParams.similarPosts}
        onRetry={() => {}}
        state={storeParams.similarPostSectionThunkInfo.state}
      />
    </SafeAreaView>
  );
}
