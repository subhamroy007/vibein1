import { ListRenderItemInfo, useWindowDimensions } from "react-native";
import { useCallback } from "react";
import Animated, { Layout } from "react-native-reanimated";
import { PostFeedItemIdentfierParams, ThunkState } from "../types/store.types";
import FullScreenPost from "./FullScreenPost";

export type FullScreenPostListProps = {
  data: PostFeedItemIdentfierParams[];
  state: ThunkState;
  onRetry: () => void;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function FullScreenPostList({
  data,
  state,
  onRetry,
}: FullScreenPostListProps) {
  const { height: screenHeight } = useWindowDimensions();

  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      switch (item.type) {
        case "post":
          return <FullScreenPost id={item.postId} />;
      }
    },
    []
  );

  return (
    <>
      <Animated.FlatList
        nestedScrollEnabled
        data={data}
        renderItem={renderItemCallback}
        keyExtractor={(item) => item.postId}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        itemLayoutAnimation={Layout.duration(300)}
        pagingEnabled
        scrollEventThrottle={16}
      />
    </>
  );
}
