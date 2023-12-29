import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect } from "react";
import { useSimilarPostsSection } from "../../../../hooks/post.hooks";
import { SIZE_20, SIZE_24 } from "../../../../constants";
import Icon from "../../../../components/Icon";
import AppText from "../../../../components/AppText";
import { layoutStyle, marginStyle } from "../../../../styles";
import ClassicPostList from "../../../../components/ClassisPostList";

export default function ClassicPostFeed() {
  const { post } = useLocalSearchParams<{ post: string }>();

  const { fetch, storeParams } = useSimilarPostsSection(post);

  const router = useRouter();

  const { top } = useSafeAreaInsets();

  const backHandler = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const postTapCallback = useCallback(
    (id: string) => {
      if (post) {
        // router.push({ pathname: `/discover/full_screen_feed/${post}` });
      }
    },
    [router, post]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (!post || !storeParams) {
    return null;
  }

  return (
    <SafeAreaView
      style={[layoutStyle.flex_1]}
      edges={["bottom", "left", "right"]}
    >
      <Stack.Screen
        options={{
          header: () => {
            return (
              <View style={[{ paddingTop: top }]}>
                <Pressable onPress={backHandler} hitSlop={SIZE_24}>
                  <Icon name="arrow-left" />
                </Pressable>
                <AppText
                  weight="bold"
                  style={marginStyle.margin_left_12}
                  size={SIZE_20}
                >
                  Posts
                </AppText>
              </View>
            );
          },
        }}
      />
      <ClassicPostList
        data={storeParams.similarPosts}
        onRetry={fetch}
        state={"success"}
        onPostTap={postTapCallback}
      />
    </SafeAreaView>
  );
}
