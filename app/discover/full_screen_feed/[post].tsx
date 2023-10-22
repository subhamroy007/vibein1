import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { layoutStyle, paddingStyle, marginStyle } from "../../../styles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { COLOR_1, HEADER_HEIGHT, SIZE_20, SIZE_24 } from "../../../constants";
import { useSimilarPostsSection } from "../../../hooks/post.hooks";
import { useCallback } from "react";
import Icon from "../../../components/Icon";
import AppText from "../../../components/AppText";
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
          header: () => {
            return (
              <View style={[styles.header, { paddingTop: top }]}>
                <Pressable onPress={backHandler} hitSlop={SIZE_24}>
                  <Icon name="arrow-left" color={COLOR_1} />
                </Pressable>
                <AppText
                  weight="bold"
                  style={marginStyle.margin_left_12}
                  size={SIZE_20}
                  color={COLOR_1}
                >
                  Posts
                </AppText>
              </View>
            );
          },
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

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_horizontal_12,
    ...layoutStyle.position_absolute,
    ...layoutStyle.width_100_percent,
  },
});
