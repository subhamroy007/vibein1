import {
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useCallback } from "react";
import ClassicPost from "./ClassicPost";
import Animated, { Layout } from "react-native-reanimated";
import { paddingStyle, layoutStyle } from "../styles";
import { PostFeedItemIdentfierParams, ThunkState } from "../types/store.types";
import AnimatedLaodingIndicator from "./AnimatedLaodingIndicator";
import {
  SIZE_24,
  SIZE_36,
  SIZE_42,
  SIZE_48,
  SIZE_60,
  SIZE_70,
} from "../constants";
import CircleIcon from "./CircleIcon";

export type ClassicPostListProps = {
  data: PostFeedItemIdentfierParams[];
  state: ThunkState;
  onRetry: () => void;
  pageState: ThunkState;
  onPageRetry: () => void;
  onPostTap: (id: string) => void;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function ClassicPostList({
  data,
  state,
  onRetry,
  onPageRetry,
  pageState,
  onPostTap,
}: ClassicPostListProps) {
  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      switch (item.type) {
        case "post":
          return <ClassicPost id={item.postId} onPress={onPostTap} />;
      }
    },
    []
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item.postId}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      contentContainerStyle={paddingStyle.padding_vertical_12}
      ListEmptyComponent={
        <View style={styles.empty_component}>
          {state === "loading" ? (
            <AnimatedLaodingIndicator size={SIZE_60} />
          ) : state === "failed" ? (
            <Pressable onPress={onRetry} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          ) : undefined}
        </View>
      }
      ListFooterComponent={
        <View style={styles.empty_component}>
          {pageState === "loading" ? (
            <AnimatedLaodingIndicator size={SIZE_60} />
          ) : pageState === "failed" ? (
            <Pressable onPress={onPageRetry} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          ) : undefined}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  empty_component: {
    ...layoutStyle.align_self_center,
    marginTop: SIZE_36,
  },
});
