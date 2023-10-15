import {
  ListRenderItemInfo,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useCallback } from "react";
import ClassicPost from "./ClassicPost";
import Animated, { Layout } from "react-native-reanimated";
import { paddingStyle } from "../styles";
import { PostFeedItemIdentfierParams, ThunkState } from "../types/store.types";
import AnimatedLaodingIndicator from "./AnimatedLaodingIndicator";
import { SIZE_24, SIZE_42, SIZE_48, SIZE_60, SIZE_70 } from "../constants";
import CircleIcon from "./CircleIcon";

export type ClassicPostListProps = {
  data: PostFeedItemIdentfierParams[];
  state: ThunkState;
  onRetry: () => void;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function ClassicPostList({
  data,
  state,
  onRetry,
}: ClassicPostListProps) {
  const { height: screenHeight } = useWindowDimensions();

  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      switch (item.type) {
        case "post":
          return <ClassicPost id={item.postId} />;
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
        state === "loading" ? (
          <AnimatedLaodingIndicator
            size={SIZE_60}
            style={{
              marginTop: (screenHeight - SIZE_60) / 2 - SIZE_70,
            }}
          />
        ) : state === "failed" ? (
          <Pressable
            style={{
              marginTop: (screenHeight - SIZE_48) / 2 - SIZE_70,
            }}
            hitSlop={SIZE_24}
            onPress={onRetry}
          >
            <CircleIcon name="retry" />
          </Pressable>
        ) : undefined
      }
    />
  );
}
